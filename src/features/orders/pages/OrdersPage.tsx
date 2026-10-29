import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { useFetch } from '@/shared/hooks/useFetch';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { orderApi } from '../api/orderApi';
import { STATUS_TEXT } from '../types/order.types';

export const OrdersPage = () => {
  const [page, setPage] = useState(0);
  const load = useCallback(() => orderApi.myOrders(page), [page]);
  const { data, error, isLoading } = useFetch(load);

  return (
    <div className="shop-page">
      <h1>My orders</h1>

      {isLoading && <p className="shop-muted">Loading orders...</p>}
      {error && <p role="alert" className="shop-error">{error}</p>}
      {data && data.content.length === 0 && (
        <p className="shop-muted">
          You have no orders yet. <Link to="/parts">Find parts</Link>
        </p>
      )}

      <ul className="order-list">
        {data?.content.map((o) => (
          <li key={o.orderNo} className="shop-card order-row">
            <div>
              <Link to={`/orders/${o.orderNo}`}>
                <strong>{o.orderNo}</strong>
              </Link>
              <p className="shop-muted">
                {formatDateTime(o.createdAt)} · {o.itemCount} {o.itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div>
              <p className={`badge status-${o.shipmentStatus}`}>{STATUS_TEXT[o.shipmentStatus]}</p>
              {o.courier && (
                <p className="shop-muted">
                  {o.courier} · {o.trackingNumber}
                </p>
              )}
            </div>
            <p className="order-total">{formatMoney(o.total, o.currency)}</p>
          </li>
        ))}
      </ul>

      {data && data.totalPages > 1 && (
        <nav className="shop-pager" aria-label="Pages">
          <Button variant="secondary" disabled={page <= 0} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span>
            Page {data.page + 1} of {data.totalPages}
          </span>
          <Button variant="secondary" disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </nav>
      )}
    </div>
  );
};
