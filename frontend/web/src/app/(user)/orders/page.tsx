'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import userApi from '@/src/lib/axios.user';
import { orderService, UserOrder } from '@/src/services/order.service';

function getFulfillmentStatusColor(status: UserOrder['fulfillmentStatus']) {
  if (status === 'DELIVERED') return 'text-green-600';
  if (status === 'CANCELLED') return 'text-red-600';
  if (status === 'SHIPPED') return 'text-blue-600';
  return 'text-amber-600';
}

function getPaymentStatusClass(status: UserOrder['paymentStatus']) {
  if (status === 'SUCCESS') return 'bg-green-100 text-green-700';
  if (status === 'FAILED') return 'bg-red-100 text-red-700';
  return 'bg-amber-100 text-amber-700';
}

function getNormalizedPaymentMethod(
  method?: UserOrder['paymentMethod'] | string,
) {
  const normalized = String(method || '')
    .trim()
    .toUpperCase();

  if (normalized === 'COD') return 'COD';
  if (normalized === 'STRIPE') return 'STRIPE';
  return null;
}

function formatPaymentMethod(method?: UserOrder['paymentMethod'] | string) {
  const normalized = getNormalizedPaymentMethod(method);
  if (normalized === 'COD') return 'Cash on Delivery';
  if (normalized === 'STRIPE') return 'Stripe';
  return 'Not available';
}

const S3_BASE = 'https://healix-product-images.s3.ap-south-1.amazonaws.com/';

function resolveImage(src?: string | null) {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return `${S3_BASE}${src}`;
}

function getOrderAddress(order: UserOrder) {
  const snapshot = order.addressSnapshot;
  if (!snapshot) return null;
  return snapshot.data ?? snapshot;
}

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnedOrderId = searchParams.get('orderId');
  const redirectStatus = searchParams.get('redirect_status');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [variantImageMap, setVariantImageMap] = useState<
    Record<string, string>
  >({});
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );

  const loadOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      const data = await orderService.getMyOrders();
      setOrders(data);
      return data;
    } catch (error) {
      console.error('Failed to load orders', error);
      toast.error('Failed to load orders');
      return [];
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const refetch = () => {
      loadOrders(true);
    };

    window.addEventListener('focus', refetch);
    document.addEventListener('visibilitychange', refetch);
    return () => {
      window.removeEventListener('focus', refetch);
      document.removeEventListener('visibilitychange', refetch);
    };
  }, [loadOrders]);

  useEffect(() => {
    const hasPendingPayments = orders.some(
      (order) => order.paymentStatus === 'PENDING',
    );
    if (!hasPendingPayments) return;

    const interval = window.setInterval(() => {
      loadOrders(true);
    }, 10000);

    return () => window.clearInterval(interval);
  }, [orders, loadOrders]);

  useEffect(() => {
    if (!returnedOrderId) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12;

    const pollStatus = async () => {
      if (cancelled) return;
      attempts += 1;

      if (redirectStatus === 'succeeded') {
        try {
          await orderService.syncStripePaymentStatus(returnedOrderId);
        } catch (error) {
          console.error('Failed to sync Stripe payment status', error);
        }
      }

      const latestOrders = await loadOrders(true);
      const order = latestOrders.find(
        (item) => item.orderId === returnedOrderId,
      );
      if (!order) {
        if (attempts >= maxAttempts) return;
        setTimeout(pollStatus, 2500);
        return;
      }

      if (order.paymentStatus === 'SUCCESS') {
        toast.success('Payment successful. Order status updated.');
        return;
      }

      if (order.paymentStatus === 'FAILED') {
        toast.error('Payment failed for this order.');
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(pollStatus, 2500);
      }
    };

    pollStatus();

    return () => {
      cancelled = true;
    };
  }, [returnedOrderId, redirectStatus, loadOrders]);

  useEffect(() => {
    const loadMissingImages = async () => {
      const missingItems = Array.from(
        new Set(
          orders
            .flatMap((order) => order.items ?? [])
            .filter((item) => !item.image && !variantImageMap[item.variantId])
            .map((item) => `${item.variantId}::${item.productId}`),
        ),
      );

      if (missingItems.length === 0) return;

      const results = await Promise.allSettled(
        missingItems.map(async (entry) => {
          const [variantId, productId] = entry.split('::');
          let image: string | undefined;

          try {
            const versionRes = await userApi.get(
              `/product/version/${variantId}`,
            );
            image = versionRes.data?.images?.[0];
          } catch {
            // continue with product-level fallback
          }

          if (!image && productId) {
            try {
              const productRes = await userApi.get(`/product/${productId}`);
              image = productRes.data?.current_version_id?.images?.[0];
            } catch {
              // keep empty
            }
          }

          return { variantId, image };
        }),
      );

      const patch: Record<string, string> = {};
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.image) {
          patch[result.value.variantId] = result.value.image;
        }
      });

      if (Object.keys(patch).length > 0) {
        setVariantImageMap((prev) => ({ ...prev, ...patch }));
      }
    };

    loadMissingImages();
  }, [orders, variantImageMap]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  );

  const payWithStripe = async (order: UserOrder) => {
    try {
      setPayingOrderId(order.orderId);
      const result = await orderService.getStripeClientSecret(order.orderId);
      if (!result?.clientSecret) {
        toast.error('Unable to start Stripe payment for this order');
        return;
      }

      router.push(
        `/checkout/stripe?clientSecret=${encodeURIComponent(
          result.clientSecret,
        )}&orderId=${encodeURIComponent(order.orderId)}`,
      );
    } catch (error) {
      console.error('Failed to start Stripe payment', error);
      toast.error('Failed to start Stripe payment');
    } finally {
      setPayingOrderId(null);
    }
  };

  const cancelOrder = async (order: UserOrder) => {
    try {
      setCancellingOrderId(order.orderId);

      await orderService.cancelOrder(order.orderId);

      toast.success('Order cancelled successfully');

      await loadOrders(true);
    } catch (error) {
      
      console.warn('Cancel request delayed, retrying status check...');

      // wait 2 seconds then reload orders
      setTimeout(async () => {
        const updated = await loadOrders(true);

        const latest = updated.find((o) => o.orderId === order.orderId);

        if (latest?.fulfillmentStatus === 'CANCELLED') {
          toast.success('Order cancelled successfully');
        } else {
          toast.error('Unable to cancel this order');
        }
        throw(error)
      }, 2000);
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <button
          onClick={() => loadOrders()}
          disabled={refreshing}
          className="text-sm bg-gray-900 text-white px-3 py-2 rounded-lg disabled:opacity-50"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {sortedOrders.length === 0 ? (
        <div className="bg-white p-4 rounded-xl shadow text-gray-600">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div key={order.orderId} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 break-all">
                    Order ID: {order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Method: {formatPaymentMethod(order.paymentMethod)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </p>
                  <p
                    className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full ${getPaymentStatusClass(order.paymentStatus)}`}
                  >
                    Payment: {order.paymentStatus}
                  </p>
                  <p
                    className={`text-sm font-medium mt-1 ${getFulfillmentStatusColor(order.fulfillmentStatus)}`}
                  >
                    {order.fulfillmentStatus}
                  </p>
                  {order.paymentStatus === 'PENDING' &&
                    order.fulfillmentStatus !== 'CANCELLED' &&
                    getNormalizedPaymentMethod(order.paymentMethod) ===
                      'STRIPE' && (
                      <button
                        onClick={() => payWithStripe(order)}
                        disabled={payingOrderId === order.orderId}
                        className="mt-2 text-xs bg-[#635bff] hover:bg-[#564ee4] text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        {payingOrderId === order.orderId
                          ? 'Starting...'
                          : 'Pay with Stripe'}
                      </button>
                    )}
                  {order.fulfillmentStatus !== 'CANCELLED' &&
                    order.fulfillmentStatus !== 'SHIPPED' &&
                    order.fulfillmentStatus !== 'DELIVERED' && (
                      <button
                        onClick={() => cancelOrder(order)}
                        disabled={cancellingOrderId === order.orderId}
                        className="mt-2 ml-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        {cancellingOrderId === order.orderId
                          ? 'Cancelling...'
                          : 'Cancel Order'}
                      </button>
                    )}
                </div>
              </div>

              {getOrderAddress(order) && (
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="text-sm font-medium">Delivery Address</p>
                  <p className="text-sm text-gray-600 mt-1 capitalize">
                    {getOrderAddress(order)?.addressType || 'Address'}
                  </p>
                  <p className="text-sm text-gray-700">
                    {getOrderAddress(order)?.addressLine1}
                    {getOrderAddress(order)?.addressLine2
                      ? `, ${getOrderAddress(order)?.addressLine2}`
                      : ''}
                    {`, ${getOrderAddress(order)?.city}, ${getOrderAddress(order)?.state}, ${getOrderAddress(order)?.country} - ${getOrderAddress(order)?.zip}`}
                  </p>
                </div>
              )}

              <div className="mt-4 border-t border-gray-100 pt-3 space-y-2">
                <p className="text-sm font-medium">Products</p>
                {order.items?.length ? (
                  <div className="space-y-1.5">
                    {order.items.map((item) => {
                      const imageSrc = resolveImage(
                        item.image ?? variantImageMap[item.variantId],
                      );

                      return (
                        <div
                          key={`${order.orderId}-${item.variantId}`}
                          className="flex items-center justify-between text-sm text-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            {!brokenImages[item.variantId] && imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={item.name}
                                className="h-10 w-10 rounded-md object-cover bg-gray-100 border border-gray-100"
                                onError={() =>
                                  setBrokenImages((prev) => ({
                                    ...prev,
                                    [item.variantId]: true,
                                  }))
                                }
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-100" />
                            )}
                            <p>
                              {item.name} x {item.quantity}
                            </p>
                          </div>
                          <p>₹{Number(item.subtotal).toFixed(2)}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Product details unavailable for this order.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
