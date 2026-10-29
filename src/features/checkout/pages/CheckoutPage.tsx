import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button } from '@/shared/components/Button';
import { InputField } from '@/shared/components/InputField';
import { formatMoney } from '@/shared/lib/format';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import type { ApiErrorBody } from '@/features/auth/types/auth.types';
import { selectCartTotal, useCartStore } from '@/features/cart/stores/cartStore';
import { orderApi } from '@/features/orders/api/orderApi';
import { checkoutSchema, type CheckoutFormValues } from '../schemas/checkout.schemas';

export const CheckoutPage = () => {
  const lines = useCartStore((s) => s.lines);
  const total = useCartStore(selectCartTotal);
  const clearCart = useCartStore((s) => s.clear);
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

  // The order was placed and the cart was cleared. Do not send a customer with an empty cart away from the result.
  if (lines.length === 0 && !isSubmitting) {
    return <Navigate to="/cart" replace />;
  }

  const onSubmit = async (address: CheckoutFormValues) => {
    setError(null);
    setProblems([]);
    try {
      // No prices are sent. order-service reads the real price from product-service.
      const order = await orderApi.checkout({
        lines: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        address,
      });
      navigate(`/orders/${order.orderNo}`, { replace: true });
      clearCart();
      toast.success(`Order ${order.orderNo} placed. Pay ${formatMoney(order.total, order.currency)} in cash on delivery.`);
    } catch (e) {
      setError(getErrorMessage(e));
      if (axios.isAxiosError<ApiErrorBody>(e)) setProblems(e.response?.data?.details ?? []);
    }
  };

  return (
    <div className="shop-page">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="shop-card">
          <h2>Delivery address</h2>
          {error && <p role="alert" className="shop-error">{error}</p>}
          {problems.length > 0 && (
            <ul className="shop-error">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}

          <InputField label="Phone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
          <InputField
            label="Address"
            autoComplete="street-address"
            error={errors.addressLine?.message}
            {...register('addressLine')}
          />
          <InputField label="City" autoComplete="address-level2" error={errors.city?.message} {...register('city')} />
          <InputField label="District" error={errors.district?.message} {...register('district')} />

          <p className="shop-muted">Payment: cash on delivery. You pay the courier when the parcel arrives.</p>
          <Button type="submit" isLoading={isSubmitting}>
            Place order
          </Button>
        </form>

        <aside className="shop-card">
          <h2>Your order</h2>
          <ul className="summary-lines">
            {lines.map((l) => (
              <li key={l.productId}>
                <span>
                  {l.quantity} × {l.name}
                </span>
                <span>{formatMoney(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <p>
            Parts total: <strong>{formatMoney(total)}</strong>
          </p>
          <p className="shop-muted">The delivery fee is added when you place the order.</p>
          <Link to="/cart">Change cart</Link>
        </aside>
      </div>
    </div>
  );
};
