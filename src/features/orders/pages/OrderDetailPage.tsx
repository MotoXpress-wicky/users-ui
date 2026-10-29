import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/shared/components/Button';
import { useFetch } from '@/shared/hooks/useFetch';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { orderApi } from '../api/orderApi';
import { STATUS_TEXT } from '../types/order.types';

export const OrderDetailPage = () => {
  const { orderNo = '' } = useParams();
  const load = useCallback(() => orderApi.myOrder(orderNo), [orderNo]);
  const { data: order, error, isLoading, reload } = useFetch(load);
  const [busy, setBusy] = useState(false);

  if (isLoading) return <p className="shop-page shop-muted">Loading...</p>;
  if (error || !order) {
    return (
      <div className="shop-page">
        <p role="alert" className="shop-error">{error ?? 'Order not found.'}</p>
        <Link to="/orders">Back to my orders</Link>
      </div>
    );
  }

  // Run one action, show the answer, then load the order again so the page shows the new state.
  const act = async (action: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await action();
      toast.success(done);
      reload();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const canCancel = order.shipmentStatus === 'NOT_SHIPPED';
  const canConfirm = order.shipmentStatus === 'DELIVERED' && !order.customerConfirmedAt;

  return (
    <div className="shop-page">
      <p>
        <Link to="/orders">&larr; My orders</Link>
      </p>
      <h1>Order {order.orderNo}</h1>
      <p className="shop-muted">Placed {formatDateTime(order.createdAt)}</p>

      <section className="shop-card">
        <p className={`badge status-${order.shipmentStatus}`}>{STATUS_TEXT[order.shipmentStatus]}</p>
        {order.shipment && (
          <p>
            Courier: <strong>{order.shipment.courier}</strong> · Tracking number:{' '}
            <strong>{order.shipment.trackingNumber}</strong>
          </p>
        )}
        {order.shipment?.deliveredAt && <p>Delivered {formatDateTime(order.shipment.deliveredAt)}</p>}
        {order.shipment?.returnedAt && <p>Returned to us {formatDateTime(order.shipment.returnedAt)}</p>}
        {order.cancelledAt && (
          <p>
            Cancelled {formatDateTime(order.cancelledAt)}
            {order.cancelledBy === 'ADMIN' ? ' by the shop' : ''}
          </p>
        )}
        {order.customerConfirmedAt && <p>You told us you received it on {formatDateTime(order.customerConfirmedAt)}.</p>}

        <div className="shop-row">
          {canCancel && (
            <Button
              variant="secondary"
              isLoading={busy}
              onClick={() => {
                if (window.confirm('Cancel this order?')) void act(() => orderApi.cancel(order.orderNo), 'Order cancelled');
              }}
            >
              Cancel order
            </Button>
          )}
          {canConfirm && (
            <Button isLoading={busy} onClick={() => void act(() => orderApi.received(order.orderNo), 'Thank you!')}>
              I received it
            </Button>
          )}
        </div>
      </section>

      <section className="shop-card">
        <h2>Items</h2>
        <ul className="summary-lines">
          {order.items.map((i) => (
            <li key={i.productId}>
              <span>
                {i.quantity} × {i.name} <span className="shop-muted">({i.partNumber})</span>
              </span>
              <span>{formatMoney(i.lineTotal, order.currency)}</span>
            </li>
          ))}
        </ul>
        <p>Parts: {formatMoney(order.itemsTotal, order.currency)}</p>
        <p>Delivery: {formatMoney(order.deliveryFee, order.currency)}</p>
        <p>
          {/* The customer pays this to the courier. */}
          Pay in cash on delivery: <strong>{formatMoney(order.total, order.currency)}</strong>
        </p>
      </section>

      <section className="shop-card">
        <h2>Delivery address</h2>
        <p>{order.customer.name}</p>
        <p>{order.customer.addressLine}</p>
        <p>
          {order.customer.city}, {order.customer.district}
        </p>
        <p>{order.customer.phone}</p>
      </section>
    </div>
  );
};
