/**
 * Shared types and formatters for admin order notification emails.
 */

export type OrderItemForEmail = {
  productTitle: string;
  variantTitle: string | null;
  sku: string;
  quantity: number;
  price: number;
  total: number;
};

/** First email after checkout: online vs cash-on-delivery wording. */
export type OrderCreatedNotice = "awaiting_online_payment" | "cash_like";

export type OrderDetailsForAdminEmail = {
  number: string;
  customerEmail: string | null;
  customerPhone: string | null;
  subtotal?: number;
  discountAmount?: number;
  shippingAmount?: number;
  couponCode?: string | null;
  total: number;
  currency: string;
  shippingAddress: unknown;
  shippingMethod: string | null;
  paymentMethod: string | null;
  items: OrderItemForEmail[];
};

export type OrderTotalsLabels = {
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
};

export type OrderForAdminEmail = OrderDetailsForAdminEmail & {
  createdNotice: OrderCreatedNotice;
};

export function formatPaymentMethod(method: string | null): string {
  if (!method) return "—";
  const labels: Record<string, string> = {
    idram: "IDram",
    arca: "ArCa",
    ameriabank: "Ameriabank",
    telcell: "Telcell",
    fastshift: "FastShift",
    pickup: "Ինքնավաճառք",
    cash: "Կանխիկ",
    cash_on_delivery: "Առաքումով վճարում",
    card: "Քարտ",
  };
  return labels[method.toLowerCase()] ?? method;
}

export function formatDeliveryDay(addr: unknown): string {
  if (addr == null || typeof addr !== "object") return "—";
  const o = addr as Record<string, unknown>;
  const raw = o.deliveryDay;
  if (!raw || typeof raw !== "string") return "—";
  const parts = raw.split("-").map(Number);
  const [year, month, day] = parts;
  if (!year || !month || !day) return raw;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("hy-AM", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCustomerName(addr: unknown): string {
  if (addr == null || typeof addr !== "object") return "—";
  const o = addr as Record<string, unknown>;
  const first = o.firstName != null ? String(o.firstName).trim() : "";
  const last = o.lastName != null ? String(o.lastName).trim() : "";
  const name = [first, last].filter(Boolean).join(" ");
  return name || "—";
}

export function formatAddress(addr: unknown): string {
  if (addr == null) return "—";
  if (typeof addr === "string") return addr;
  if (typeof addr === "object" && addr !== null) {
    const o = addr as Record<string, unknown>;
    const parts = [
      o.address,
      o.addressLine1,
      o.city,
      o.region,
      o.state,
      o.postalCode,
      o.country,
    ]
      .filter(Boolean)
      .map(String);
    return parts.join(", ") || "—";
  }
  return "—";
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function buildCreatedNoticeBanner(
  createdNotice: OrderCreatedNotice
): string {
  if (createdNotice === "awaiting_online_payment") {
    return `
    <div style="background:#fef3c7;border-radius:8px;padding:14px 18px;margin-bottom:20px;font-size:14px;color:#92400e;border:1px solid #fcd34d;">
      <strong>Վճարման կարգավիճակ՝</strong> Սպասում ենք առցանց վճարման
    </div>`;
  }
  return `
    <div style="background:#ecfdf5;border-radius:8px;padding:14px 18px;margin-bottom:20px;font-size:14px;color:#065f46;border:1px solid #6ee7b7;">
      <strong>Վճարման կարգավիճակ՝</strong> Կանխիկ / առաքումով վճարում (առցանց վճարում չի սպասվում)
    </div>`;
}

export function buildItemsRows(order: OrderDetailsForAdminEmail): string {
  return order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;">${escapeHtml(item.productTitle)}${item.variantTitle ? ` (${escapeHtml(item.variantTitle)})` : ""}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;">${escapeHtml(item.sku)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(item.price)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(item.total)}</td>
    </tr>`
    )
    .join("");
}

function resolveOrderSubtotal(order: OrderDetailsForAdminEmail): number {
  if (order.subtotal != null && Number.isFinite(order.subtotal)) {
    return order.subtotal;
  }
  return order.items.reduce((sum, item) => sum + item.total, 0);
}

export function buildOrderTotalsHtml(
  order: OrderDetailsForAdminEmail,
  labels: OrderTotalsLabels
): string {
  const subtotal = resolveOrderSubtotal(order);
  const discount = Number(order.discountAmount ?? 0);
  const shipping = Number(order.shippingAmount ?? 0);
  const couponCode = order.couponCode?.trim();
  const currency = escapeHtml(order.currency);

  const row = (label: string, value: string, valueColor = "#1e293b") =>
    `<tr>
      <td style="padding:6px 0;color:#64748b;text-align:right;">${escapeHtml(label)}</td>
      <td style="padding:6px 0 6px 16px;text-align:right;font-weight:600;color:${valueColor};white-space:nowrap;">${value}</td>
    </tr>`;

  const rows = [row(labels.subtotal, `${formatMoney(subtotal)} ${currency}`)];

  if (discount > 0) {
    const discountLabel = couponCode
      ? `${labels.discount} (${couponCode})`
      : labels.discount;
    rows.push(
      row(
        discountLabel,
        `-${formatMoney(discount)} ${currency}`,
        "#15803d"
      )
    );
  }

  if (shipping > 0) {
    rows.push(row(labels.shipping, `${formatMoney(shipping)} ${currency}`));
  }

  rows.push(
    `<tr>
      <td style="padding:10px 0 0;color:#1e293b;text-align:right;font-size:16px;font-weight:700;">${escapeHtml(labels.total)}</td>
      <td style="padding:10px 0 0 16px;text-align:right;font-size:18px;font-weight:700;color:#1e293b;white-space:nowrap;">${formatMoney(order.total)} ${currency}</td>
    </tr>`
  );

  return `<table style="width:100%;max-width:280px;margin-left:auto;margin-top:16px;border-collapse:collapse;font-size:14px;">${rows.join("")}</table>`;
}

export function buildOrderTotalsTextLines(
  order: OrderDetailsForAdminEmail,
  labels: OrderTotalsLabels
): string[] {
  const subtotal = resolveOrderSubtotal(order);
  const discount = Number(order.discountAmount ?? 0);
  const shipping = Number(order.shippingAmount ?? 0);
  const couponCode = order.couponCode?.trim();
  const lines = [`${labels.subtotal}: ${formatMoney(subtotal)} ${order.currency}`];

  if (discount > 0) {
    const discountLabel = couponCode
      ? `${labels.discount} (${couponCode})`
      : labels.discount;
    lines.push(`${discountLabel}: -${formatMoney(discount)} ${order.currency}`);
  }

  if (shipping > 0) {
    lines.push(`${labels.shipping}: ${formatMoney(shipping)} ${order.currency}`);
  }

  lines.push(`${labels.total}: ${formatMoney(order.total)} ${order.currency}`);
  return lines;
}

export function createdNoticeTextLine(
  createdNotice: OrderCreatedNotice
): string {
  if (createdNotice === "awaiting_online_payment") {
    return "Վճարման կարգավիճակ՝ Սպասում ենք առցանց վճարման";
  }
  return "Վճարման կարգավիճակ՝ Կանխիկ / առաքումով վճարում";
}
