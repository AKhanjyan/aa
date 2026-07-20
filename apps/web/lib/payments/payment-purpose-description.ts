/** Max length for PSP purpose/description fields. */
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

/** Same display as orders UI: Պատվեր #P473 */
function buildOrderNumberLine(orderNumber: string): string {
  return `Պատվեր #${orderNumber.trim()}`;
}

/**
 * Build payment purpose text for bank/PSP description fields.
 * Uses the real order number (e.g. P473) as shown in orders — UTF-8 OK.
 * Payment amount is shown separately by the bank; do not repeat total here.
 */
export function buildPaymentPurposeDescription(
  order: PaymentPurposeOrder
): string {
  const orderNumberLine = buildOrderNumberLine(order.number);
  const couponCode = order.couponCode?.trim();
  const discountAmount = Number(order.discountAmount ?? 0);
  const currency = (order.currency?.trim() || "AMD").toUpperCase();

  if (!couponCode || !Number.isFinite(discountAmount) || discountAmount <= 0) {
    return truncatePurpose(orderNumberLine);
  }

  const couponLine = `Կուպոն ${couponCode} զեղչ ${formatAmount(discountAmount)} ${currency}`;
  return truncatePurpose(`${orderNumberLine}\r\n${couponLine}`);
}
