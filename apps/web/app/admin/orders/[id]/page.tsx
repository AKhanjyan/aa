'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../lib/auth/AuthContext';
import { Card } from '@shop/ui';
import { apiClient } from '../../../../lib/api-client';
import { useTranslation } from '../../../../lib/i18n-client';
import { ProductPageButton } from '../../../../components/icons/global/globalMobile';
import { formatPrice, getStoredCurrency, convertPrice, type CurrencyCode } from '../../../../lib/currency';

interface OrderDetails {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  total: number;
  currency: string;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  taxAmount: number;
  totals?: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
  };
  customerEmail?: string;
  customerPhone?: string;
  customer?: {
    id: string;
    email: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
  billingAddress?: any | null;
  shippingAddress?: any | null;
  shippingMethod?: string | null;
  notes?: string | null;
  adminNotes?: string | null;
  payment?: {
    id: string;
    provider: string;
    method?: string | null;
    amount: number;
    currency: string;
    status: string;
    cardLast4?: string | null;
    cardBrand?: string | null;
  } | null;
  items: Array<{
    id: string;
    productTitle: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    variantOptions?: Array<{
      attributeKey?: string;
      value?: string;
      label?: string;
      imageUrl?: string;
      colors?: string[] | any;
    }>;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = typeof params?.id === 'string' ? params.id : '';
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>(getStoredCurrency());
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null);
  const [loadingDeliveryPrice, setLoadingDeliveryPrice] = useState(false);

  useEffect(() => {
    const handleCurrencyUpdate = () => {
      setCurrency(getStoredCurrency());
    };

    window.addEventListener('currency-updated', handleCurrencyUpdate);

    return () => {
      window.removeEventListener('currency-updated', handleCurrencyUpdate);
    };
  }, []);

  // Helper function to get color hex/rgb from color name
  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'beige': '#F5F5DC', 'black': '#000000', 'blue': '#0000FF', 'brown': '#A52A2A',
      'gray': '#808080', 'grey': '#808080', 'green': '#008000', 'red': '#FF0000',
      'white': '#FFFFFF', 'yellow': '#FFFF00', 'orange': '#FFA500', 'pink': '#FFC0CB',
      'purple': '#800080', 'navy': '#000080', 'maroon': '#800000', 'olive': '#808000',
      'teal': '#008080', 'cyan': '#00FFFF', 'magenta': '#FF00FF', 'lime': '#00FF00',
      'silver': '#C0C0C0', 'gold': '#FFD700',
    };
    const normalizedName = colorName.toLowerCase().trim();
    return colorMap[normalizedName] || '#CCCCCC';
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !isAdmin) {
        router.push('/admin');
        return;
      }
    }
  }, [isLoggedIn, isAdmin, isLoading, router]);

  useEffect(() => {
    // If we somehow don't have an order id, don't call the API
    if (!orderId) {
      console.error('❌ [ADMIN][OrderDetails] Missing orderId from route params');
      setError(t('admin.orders.orderDetails.orderIdMissing'));
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📂 [ADMIN][OrderDetails] Loading order details page...', { orderId });
        const response = await apiClient.get<OrderDetails>(`/api/v1/admin/orders/${orderId}`);
        console.log('✅ [ADMIN][OrderDetails] Order details loaded:', response);
        setOrder(response);
      } catch (err: any) {
        console.error('❌ [ADMIN][OrderDetails] Failed to load order details:', err);
        setError(err?.message || t('admin.orders.orderDetails.failedToLoad'));
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && isAdmin) {
      loadOrder();
    }
  }, [isLoggedIn, isAdmin, orderId]);

  // Fetch delivery price when order is loaded and shipping is 0 but city exists
  useEffect(() => {
    const fetchDeliveryPrice = async () => {
      if (!order) return;
      
      const shippingCity = order.shippingAddress?.city;
      const currentShipping = order.totals?.shipping ?? order.shippingAmount ?? 0;
      
      // Only fetch if: delivery method, city exists, and shipping is 0
      if (
        order.shippingMethod === 'delivery' &&
        shippingCity &&
        shippingCity.trim().length > 0 &&
        currentShipping === 0
      ) {
        setLoadingDeliveryPrice(true);
        try {
          console.log('🚚 [ADMIN][OrderDetails] Fetching delivery price for city:', shippingCity);
          const response = await apiClient.get<{ price: number }>('/api/v1/delivery/price', {
            params: {
              city: shippingCity.trim(),
              country: 'Armenia',
            },
          });
          console.log('✅ [ADMIN][OrderDetails] Delivery price fetched:', response.price);
          setDeliveryPrice(response.price);
        } catch (err: any) {
          console.error('❌ [ADMIN][OrderDetails] Error fetching delivery price:', err);
          setDeliveryPrice(null);
        } finally {
          setLoadingDeliveryPrice(false);
        }
      } else {
        setDeliveryPrice(null);
      }
    };

    fetchDeliveryPrice();
  }, [order]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.orders.orderDetails.loadingOrderDetails')}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <ProductPageButton
              variant="outline"
              className="mb-2 flex items-center text-xs px-3 py-1"
              onClick={() => router.push('/admin/orders')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('admin.orders.orderDetails.backToOrders')}
            </ProductPageButton>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('admin.orders.orderDetails.title')} {order ? `#${order.number}` : ''}
            </h1>
            {order && (
              <p className="mt-1 text-sm text-gray-500">
                {t('admin.orders.orderDetails.createdAt')} {new Date(order.createdAt).toLocaleString()}
                {order.updatedAt ? ` • ${t('admin.orders.orderDetails.updatedAt')} ${new Date(order.updatedAt).toLocaleString()}` : ''}
              </p>
            )}
          </div>
        </div>

        {error && (
          <Card className="p-4 mb-4 border border-red-200 bg-red-50">
            <div className="text-sm text-red-700">{error}</div>
          </Card>
        )}

        {!order && !error && (
          <Card className="p-4">
            <div className="text-sm text-gray-600">{t('admin.orders.orderDetails.orderNotFound')}</div>
          </Card>
        )}

        {order && (
          <div className="space-y-6">
            {/* Summary */}
            <Card className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">{t('admin.orders.orderDetails.summary')}</h2>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="font-medium">{t('admin.orders.orderDetails.orderNumber')}</span> {order.number}
                    </div>
                    <div>
                      <span className="font-medium">{t('admin.orders.orderDetails.total')}</span>{' '}
                      {formatPrice(order.totals?.total ?? order.total, currency)}
                    </div>
                    <div>
                      <span className="font-medium">{t('admin.orders.orderDetails.status')}</span> {order.status}
                    </div>
                    <div>
                      <span className="font-medium">{t('admin.orders.orderDetails.payment')}</span> {order.paymentStatus}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">{t('admin.orders.orderDetails.customer')}</h2>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      {(order.customer?.firstName || '') +
                        (order.customer?.lastName ? ' ' + order.customer.lastName : '') ||
                        t('admin.orders.unknownCustomer')}
                    </div>
                    {order.customerPhone && <div>{order.customerPhone}</div>}
                    {order.customerEmail && <div>{order.customerEmail}</div>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Addresses & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 md:p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">{t('admin.orders.orderDetails.shippingAddress')}</h2>
                {order.shippingMethod === 'pickup' ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="font-medium">{t('admin.orders.orderDetails.shippingMethod')}</span>{' '}
                      {t('checkout.shipping.storePickup')}
                    </div>
                    <p className="text-gray-500 mt-2">{t('checkout.shipping.storePickupDescription')}</p>
                  </div>
                ) : order.shippingMethod === 'delivery' && order.shippingAddress ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="mb-2">
                      <span className="font-medium">{t('admin.orders.orderDetails.shippingMethod')}</span>{' '}
                      {t('checkout.shipping.delivery')}
                    </div>
                    {(order.shippingAddress.address || order.shippingAddress.addressLine1) && (
                      <div>
                        <span className="font-medium">{t('checkout.form.address')}:</span>{' '}
                        {order.shippingAddress.address || order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                      </div>
                    )}
                    {order.shippingAddress.city && (
                      <div>
                        <span className="font-medium">{t('checkout.form.city')}:</span> {order.shippingAddress.city}
                      </div>
                    )}
                    {order.shippingAddress.postalCode && (
                      <div>
                        <span className="font-medium">{t('checkout.form.postalCode')}:</span> {order.shippingAddress.postalCode}
                      </div>
                    )}
                    {(order.shippingAddress.phone || order.shippingAddress.shippingPhone) && (
                      <div className="mt-2">
                        <span className="font-medium">{t('checkout.form.phoneNumber')}:</span>{' '}
                        {order.shippingAddress.phone || order.shippingAddress.shippingPhone}
                      </div>
                    )}

                    {/* Delivery schedule info */}
                    {(order.shippingAddress as any)?.deliveryDay && (
                      <div className="mt-2">
                        <span className="font-medium">
                          {t('admin.orders.orderDetails.deliveryDay')}
                        </span>{' '}
                        {(() => {
                          const raw = (order.shippingAddress as any).deliveryDay as string;
                          // raw is stored as "YYYY-MM-DD" (date-only). Parse manually to avoid timezone shifts.
                          const parts = raw?.split('-').map((p) => Number(p)) || [];
                          const [year, month, day] = parts;
                          if (!year || !month || !day) {
                            return raw;
                          }
                          const date = new Date(year, month - 1, day);
                          if (isNaN(date.getTime())) {
                            return raw;
                          }
                          return date.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            weekday: 'long',
                          });
                        })()}
                      </div>
                    )}
                    {(order.shippingAddress as any)?.deliveryTimeSlot && (
                      <div>
                        <span className="font-medium">
                          {t('admin.orders.orderDetails.deliveryTimeSlot')}
                        </span>{' '}
                        {(() => {
                          const slot = (order.shippingAddress as any).deliveryTimeSlot as string;
                          if (slot === 'first_half') {
                            return t('checkout.delivery.timeSlots.firstHalf');
                          }
                          if (slot === 'second_half') {
                            return t('checkout.delivery.timeSlots.secondHalf');
                          }
                          return slot;
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>{t('admin.orders.orderDetails.noShippingAddress')}</p>
                    {order.shippingMethod && (
                      <p>
                        {t('admin.orders.orderDetails.shippingMethod')}{' '}
                        {order.shippingMethod === 'pickup' 
                          ? t('admin.orders.orderDetails.pickup')
                          : order.shippingMethod === 'delivery'
                          ? t('checkout.shipping.delivery')
                          : order.shippingMethod}
                      </p>
                    )}
                  </div>
                )}
              </Card>

              <Card className="p-4 md:p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">{t('admin.orders.orderDetails.paymentInfo')}</h2>
                {order.payment ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    {order.payment.method && <div>{t('admin.orders.orderDetails.method')} {order.payment.method}</div>}
                    <div>
                      {t('admin.orders.orderDetails.amount')}{' '}
                      {formatPrice(order.payment.amount, currency)}
                    </div>
                    <div>{t('admin.orders.orderDetails.status')} {order.payment.status}</div>
                    {order.payment.cardBrand && order.payment.cardLast4 && (
                      <div>
                        {t('admin.orders.orderDetails.card')} {order.payment.cardBrand} ••••{order.payment.cardLast4}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">{t('admin.orders.orderDetails.noPaymentInfo')}</div>
                )}
              </Card>
            </div>

            {/* Items */}
            <Card className="p-4 md:p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{t('admin.orders.orderDetails.items')}</h2>
              {Array.isArray(order.items) && order.items.length > 0 ? (
                <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">{t('admin.orders.orderDetails.product')}</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">{t('admin.orders.orderDetails.sku')}</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-500">{t('admin.orders.orderDetails.colorSize')}</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-500">{t('admin.orders.orderDetails.qty')}</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-500">{t('admin.orders.orderDetails.price')}</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-500">{t('admin.orders.orderDetails.totalCol')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {order.items.map((item) => {
                        // Get all variant options (not just color and size)
                        const allOptions = item.variantOptions || [];
                        
                        // Helper to check if colors array is valid
                        const getColorsArray = (colors: any): string[] => {
                          if (!colors) return [];
                          if (Array.isArray(colors)) return colors;
                          if (typeof colors === 'string') {
                            try {
                              const parsed = JSON.parse(colors);
                              return Array.isArray(parsed) ? parsed : [];
                            } catch {
                              return [];
                            }
                          }
                          return [];
                        };

                        return (
                          <tr key={item.id}>
                            <td className="px-3 py-2">{item.productTitle}</td>
                            <td className="px-3 py-2 text-gray-500">{item.sku}</td>
                            <td className="px-3 py-2">
                              {allOptions.length > 0 ? (
                                <div className="flex flex-wrap gap-2 items-center">
                                  {allOptions.map((opt, optIndex) => {
                                    if (!opt.attributeKey || !opt.value) return null;
                                    
                                    const attributeKey = opt.attributeKey.toLowerCase().trim();
                                    const isColor = attributeKey === 'color' || attributeKey === 'colour';
                                    const displayLabel = opt.label || opt.value;
                                    const hasImage = opt.imageUrl && opt.imageUrl.trim() !== '';
                                    const colors = getColorsArray(opt.colors);
                                    const colorHex = colors.length > 0 ? colors[0] : (isColor ? getColorValue(opt.value) : null);
                                    
                                    return (
                                      <div key={optIndex} className="flex items-center gap-1.5">
                                        {/* Show image if available */}
                                        {hasImage ? (
                                          <img 
                                            src={opt.imageUrl!} 
                                            alt={displayLabel}
                                            className="w-4 h-4 rounded border border-gray-300 object-cover flex-shrink-0"
                                            onError={(e) => {
                                              // Fallback to color circle if image fails to load
                                              (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                          />
                                        ) : isColor && colorHex ? (
                                          <div 
                                            className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                            style={{ backgroundColor: colorHex }}
                                            title={displayLabel}
                                          />
                                        ) : null}
                                        <span className="text-xs text-gray-700 capitalize">
                                          {displayLabel}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right">{item.quantity}</td>
                            <td className="px-3 py-2 text-right">
                              {formatPrice(item.unitPrice, currency)}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {formatPrice(item.total, currency)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-gray-500">{t('admin.orders.orderDetails.noItemsFound')}</div>
              )}
            </Card>

            {/* Order Summary */}
            <Card className="p-4 md:p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">{t('checkout.orderSummary')}</h2>
              <div className="space-y-3">
                {(() => {
                  // Use same calculation logic as Checkout Order Summary
                  // Order totals.subtotal is non-discounted, discount is stored separately
                  const originalSubtotal = order.totals?.subtotal ?? order.subtotal ?? 0;
                  const discount = order.totals?.discount ?? order.discountAmount ?? 0;
                  // Calculate discounted subtotal: original - discount
                  // If discount is 0, items might already be discounted, so use items total
                  const subtotal = discount > 0 
                    ? originalSubtotal - discount
                    : order.items.reduce((sum, item) => sum + (item.total || 0), 0);
                  // Shipping: 0 for pickup, otherwise use shipping amount or fetched delivery price
                  // If shipping is 0 but deliveryPrice is fetched, use deliveryPrice (same as Checkout)
                  const baseShipping = order.shippingMethod === 'pickup' 
                    ? 0 
                    : (order.totals?.shipping ?? order.shippingAmount ?? 0);
                  // Use deliveryPrice if shipping is 0 and deliveryPrice is available
                  const shipping = baseShipping === 0 && deliveryPrice !== null
                    ? convertPrice(deliveryPrice, 'AMD', 'USD')
                    : baseShipping;
                  const tax = order.totals?.tax ?? order.taxAmount ?? 0;
                  // Calculate total the same way Checkout does: subtotal + shipping
                  const total = subtotal + shipping;

                  return (
                    <>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{t('checkout.summary.subtotal')}</span>
                        <span>{formatPrice(subtotal, currency)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{t('checkout.summary.discount')}</span>
                          <span>-{formatPrice(discount, currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{t('checkout.summary.shipping')}</span>
                        <span>
                          {order.shippingMethod === 'pickup'
                            ? t('common.cart.free')
                            : loadingDeliveryPrice
                              ? t('checkout.shipping.loading')
                              : order.shippingAddress?.city
                                ? formatPrice(shipping, currency) + (order.shippingAddress.city ? ` (${order.shippingAddress.city})` : '')
                                : t('checkout.shipping.enterCity')}
                        </span>
                      </div>
                      {tax > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{t('checkout.summary.tax')}</span>
                          <span>{formatPrice(tax, currency)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between text-base font-bold text-gray-900">
                          <span>{t('checkout.summary.total')}</span>
                          <span>{formatPrice(total, currency)}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


