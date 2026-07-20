import type { Order, OrderItem, Payment, ProductLabel } from "@prisma/client";
import { getConfig } from "./config";
import { ehdmPost } from "./client";
import type {
  EhdmPrintRequestBody,
  EhdmPrintResponse,
  EhdmPrintItem,
} from "./types";

const MODE_SALE_WITH_ITEMS = 2;
const GOOD_NAME_MAX_LENGTH = 30;
const PRODUCT_LABEL_TYPE_TEXT = "text";
/** EHDM: monetary coupon/order discount on line total — (price × qty) − additionalDiscount */
const EHDM_ADDITIONAL_DISCOUNT_TYPE_MONETARY = 16;

export type OrderItemWithProductLabels = OrderItem & {
  variant?: {
    product?: {
      labels?: ProductLabel[];
    } | null;
  } | null;
};

export type OrderWithItemsAndPayments = Order & {
  items: OrderItemWithProductLabels[];
  payments?: Payment[];
};

/**
 * Text label values from product card (admin Labels → Արժեք), e.g. "0.33Լ".
 */
function getTextLabelValues(item: OrderItemWithProductLabels): string[] {
  const labels = item.variant?.product?.labels ?? [];
  return labels
    .filter(
      (label) =>
        label.type === PRODUCT_LABEL_TYPE_TEXT && Boolean(label.value?.trim())
    )
    .map((label) => label.value.trim());
}

/** goodName = productTitle + label values, truncated to EHDM limit. */
function buildGoodName(
  productTitle: string,
  labelValues: string[]
): string {
  const title = (productTitle || "Product").trim() || "Product";
  const suffix = labelValues.join(" ").trim();
  const combined = suffix ? `${title} ${suffix}` : title;
  return combined.slice(0, GOOD_NAME_MAX_LENGTH);
}

function roundEhdmMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Split order-level coupon discount across product lines proportional to line totals.
 * Last line absorbs rounding remainder so allocations sum exactly to couponDiscount.
 */
function allocateCouponDiscountAcrossLines(
  lineTotals: number[],
  couponDiscount: number
): number[] {
  if (couponDiscount <= 0 || lineTotals.length === 0) {
    return lineTotals.map(() => 0);
  }

  const subtotal = lineTotals.reduce((sum, total) => sum + total, 0);
  if (subtotal <= 0) {
    return lineTotals.map(() => 0);
  }

  const cappedDiscount = Math.min(couponDiscount, subtotal);
  const allocations: number[] = [];
  let allocated = 0;

  for (let i = 0; i < lineTotals.length; i++) {
    if (i === lineTotals.length - 1) {
      allocations.push(roundEhdmMoney(cappedDiscount - allocated));
      continue;
    }
    const share = roundEhdmMoney((cappedDiscount * lineTotals[i]) / subtotal);
    allocations.push(share);
    allocated += share;
  }

  return allocations;
}

/**
 * Build EHDM /print request body from order and config.
 */
export function buildPrintBody(
  order: OrderWithItemsAndPayments,
  seq: number
): EhdmPrintRequestBody {
  const config = getConfig();
  const total = Number(order.total);
  const isCash =
    order.payments?.some((p) => p.provider === "cash_on_delivery") ?? false;

  const items: EhdmPrintItem[] = [];
  const couponDiscount = Number(order.discountAmount) || 0;
  const couponAllocations = allocateCouponDiscountAcrossLines(
    order.items.map((item) => Number(item.total)),
    couponDiscount
  );

  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    const quantity = Number(item.quantity);
    const unitPrice =
      quantity > 0 ? Number(item.total) / quantity : Number(item.price);
    const goodName = buildGoodName(
      item.productTitle,
      getTextLabelValues(item)
    );
    const printItem: EhdmPrintItem = {
      dep: config.dep,
      adgCode: config.defaultAdgCode,
      goodCode: item.sku || "0",
      goodName,
      quantity,
      unit: config.defaultUnit,
      price: roundEhdmMoney(unitPrice),
    };
    const lineCouponDiscount = couponAllocations[i] ?? 0;
    if (lineCouponDiscount > 0) {
      printItem.additionalDiscount = lineCouponDiscount;
      printItem.additionalDiscountType = EHDM_ADDITIONAL_DISCOUNT_TYPE_MONETARY;
    }
    items.push(printItem);
  }

  if (config.shippingEnabled && order.shippingAmount != null && Number(order.shippingAmount) > 0) {
    items.push({
      dep: config.dep,
      adgCode: config.shippingAdgCode,
      goodCode: config.shippingGoodCode,
      goodName: config.shippingDescription,
      quantity: 1,
      unit: config.shippingUnit,
      price: Number(order.shippingAmount),
    });
  }

  const body: EhdmPrintRequestBody = {
    mode: MODE_SALE_WITH_ITEMS,
    crn: config.crn,
    seq,
    cashierId: config.cashierId,
    partialAmount: 0,
    prePaymentAmount: 0,
    partnerTin: null,
    items,
  };

  if (isCash) {
    body.cashAmount = total;
    body.cardAmount = 0;
  } else {
    body.cardAmount = total;
    body.cashAmount = 0;
  }

  return body;
}

/**
 * Call EHDM /print and return parsed response.
 */
export async function callPrint(
  body: EhdmPrintRequestBody
): Promise<EhdmPrintResponse> {
  return ehdmPost<EhdmPrintResponse>("/print", body);
}
