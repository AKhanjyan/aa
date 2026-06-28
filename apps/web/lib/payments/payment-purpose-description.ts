/** Conservative max length for PSP purpose/description fields. */
export const PAYMENT_PURPOSE_MAX_LENGTH = 255;

export type PaymentPurposeOrder = {
  number: string;
  total?: number | null;
  couponCode?: string | null;
  discountAmount?: number | null;
  currency?: string | null;
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function truncatePurpose(value: string): string {
  if (value.length <= PAYMENT_PURPOSE_MAX_LENGTH) {
    return value;
  }
  return value.slice(0, PAYMENT_PURPOSE_MAX_LENGTH);
}

function buildOrderNumberLine(orderNumber: string): string {
  return `number ${orderNumber.trim().toLowerCase()}`;
}

/**
 * Build payment purpose text for bank/PSP / 3DS description fields.
 * ASCII-only (no Armenian) — 3DS pages often mangle UTF-8 as "????".
 * Payment amount is shown separately by the bank; do not repeat total here.
 */
export function buildPaymentPurposeDescription(
  order: PaymentPurposeOrder
): string {
  const orderNumberLine = buildOrderNumberLine(order.number);
  const couponCode = order.couponCode?.trim();
  const discountAmount = Number(order.discountAmount ?? 0);
  const currency = (order.currency?.trim() || "AMD").toLowerCase();

  if (!couponCode || !Number.isFinite(discountAmount) || discountAmount <= 0) {
    return truncatePurpose(orderNumberLine);
  }

  const couponLine = `cupon ${couponCode} zexch ${formatAmount(discountAmount)} ${currency}`;
  return truncatePurpose(`${orderNumberLine}\r\n${couponLine}`);
}
