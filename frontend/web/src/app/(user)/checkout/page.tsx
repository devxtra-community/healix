'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CreditCard, MapPinHouse, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { addressService, SavedAddress } from '@/src/services/address.service';
import {
  checkoutService,
  PaymentMethod,
} from '@/src/services/checkout.service';
import { cartService } from '@/src/services/cart.service';
import OrderSuccessOverlay from '@/src/components/OrderSuccessOverlay';

type CartItem = {
  variantId: string;
  name: string;
  quantity?: number;
  price?: number;
  subtotal?: number;
};

type CartResponse = {
  items?: CartItem[];
};

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('STRIPE');

  useEffect(() => {
    const loadCheckoutContext = async () => {
      try {
        const [cart, savedAddresses] = await Promise.all([
          cartService.getCart() as Promise<CartResponse>,
          addressService.getAddresses(),
        ]);

        setItems(cart.items ?? []);
        setAddresses(savedAddresses);

        if (savedAddresses.length > 0) {
          setSelectedAddressId(savedAddresses[0]._id);
        }
      } catch (error) {
        console.error('Failed to load checkout context', error);
        toast.error('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutContext();
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const subtotal =
        item.subtotal ?? (item.price ?? 0) * (item.quantity ?? 0);
      return sum + subtotal;
    }, 0);
  }, [items]);

  const placeOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Select a delivery address');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (
      paymentMethod === 'STRIPE' &&
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ) {
      toast.error(
        'Stripe is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in frontend env.',
      );
      return;
    }

    setPlacingOrder(true);

    try {
      if (paymentMethod === 'STRIPE') {
        const res =
          await checkoutService.createStripeSession(selectedAddressId);

        if (!res.sessionUrl) {
          toast.error('Unable to start Stripe checkout');
          return;
        }

        window.location.href = res.sessionUrl;
        return;
      }

      const res = await checkoutService.checkout({
        addressId: selectedAddressId,
        paymentMethod: 'COD',
      });

      if (res.status !== 'PROCESSING') {
        toast.error(res.message ?? 'Unable to proceed with checkout');
        return;
      }

      setShowSuccess(true);
    } catch (error) {
      console.error('Checkout failed', error);
      toast.error('Checkout failed');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleOverlayComplete = async () => {
    router.push('/orders');
  };

  if (loading) {
    return <div className="p-6">Loading checkout...</div>;
  }

  return (
    <>
      {showSuccess && (
        <OrderSuccessOverlay onComplete={handleOverlayComplete} />
      )}
      <div className="max-w-5xl mx-auto py-6 md:py-10 space-y-8">
        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select address and payment method to place your order.
          </p>
        </section>

        {/* Addresses */}
        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <MapPinHouse className="h-5 w-5" />
              Saved Addresses
            </h2>

            <button
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={() => router.push('/addresses')}
            >
              Manage
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
              No saved addresses found. Add one to continue checkout.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <label
                  key={address._id}
                  className={`block border rounded-xl p-4 cursor-pointer transition ${
                    selectedAddressId === address._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="address"
                      value={address._id}
                      checked={selectedAddressId === address._id}
                      onChange={() => setSelectedAddressId(address._id)}
                      className="mt-1"
                    />

                    <div>
                      <p className="font-medium capitalize">
                        {address.addressType}
                      </p>

                      <p className="text-sm text-gray-700">
                        {address.addressLine1}
                        {address.addressLine2
                          ? `, ${address.addressLine2}`
                          : ''}
                        {`, ${address.city}, ${address.state}, ${address.country} - ${address.zip}`}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* Payment */}
        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('COD')}
              className={`rounded-xl p-4 text-left border transition ${
                paymentMethod === 'COD'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-gray-600">Pay when delivered</p>
            </button>

            <button
              onClick={() => setPaymentMethod('STRIPE')}
              className={`rounded-xl p-4 text-left border transition ${
                paymentMethod === 'STRIPE'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium">Stripe</p>
              <p className="text-sm text-gray-600">
                Card or other Stripe payment methods
              </p>
            </button>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5" />
            Order Summary
          </h2>

          {items.length === 0 ? (
            <p className="text-sm text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-3 mb-5">
              {items.map((item) => {
                const subtotal =
                  item.subtotal ?? (item.price ?? 0) * (item.quantity ?? 0);

                return (
                  <div
                    key={item.variantId}
                    className="flex items-center justify-between text-sm"
                  >
                    <p className="text-gray-700">
                      {item.name} x {item.quantity ?? 0}
                    </p>

                    <p className="font-medium">₹{subtotal.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="font-semibold">Total</p>
            <p className="text-xl font-bold">₹{total.toFixed(2)}</p>
          </div>

          <button
            onClick={placeOrder}
            disabled={
              placingOrder || items.length === 0 || addresses.length === 0
            }
            className="mt-5 w-full bg-[#00e676] hover:bg-[#00c853] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {placingOrder ? 'Processing...' : 'Place Order'}
            <ArrowRight size={18} />
          </button>
        </section>
      </div>
    </>
  );
}
