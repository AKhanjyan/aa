/**
 * Checkout emails: admin always; customer only for cash/COD.
 * Uses Next.js `after()` so Vercel does not drop in-flight Resend calls after the HTTP response.
 */

import { after } from "next/server";
import { db } from "@white-shop/db";
import { isCashLikePaymentMethod } from "@/lib/payments/constants";
import { notifyCustomerCashOrderEmail } from "@/lib/email-templates/notify-customer-order-paid";
import {
  sendOrderNotificationToAdmin,
  type OrderItemForEmail,
} from "@/lib/email-templates/order-admin-notification";

export function scheduleCheckoutOrderEmails(orderId: string): void {
  after(async () => {
    try {
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { items: true, payments: true },
      });
      if (!order) {
        console.error(
          "[EMAIL] scheduleCheckoutOrderEmails: order not found",
          orderId
        );
        return;
      }

      const paymentMethod =
        order.payments[0]?.method ?? order.payments[0]?.provider ?? null;
      const items: OrderItemForEmail[] = order.items.map((i) => ({
        productTitle: i.productTitle,
        variantTitle: i.variantTitle,
        sku: i.sku,
        quantity: i.quantity,
        price: i.price,
        total: i.total,
      }));

      await sendOrderNotificationToAdmin({
        number: order.number,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        total: order.total,
        currency: order.currency ?? "AMD",
        shippingAddress: order.shippingAddress,
        shippingMethod: order.shippingMethod,
        paymentMethod,
        items,
        createdNotice: isCashLikePaymentMethod(paymentMethod)
          ? "cash_like"
          : "awaiting_online_payment",
      });

      if (isCashLikePaymentMethod(paymentMethod)) {
        await notifyCustomerCashOrderEmail(orderId);
      }
    } catch (err) {
      console.error("[EMAIL] scheduleCheckoutOrderEmails failed:", orderId, err);
    }
  });
}
