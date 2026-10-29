import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { formatMoney, mediaUrl } from '@/shared/lib/format';
import { MAX_LINE_QUANTITY, selectCartTotal, useCartStore } from '../stores/cartStore';

export const CartPage = () => {
  const lines = useCartStore((s) => s.lines);
  const total = useCartStore(selectCartTotal);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const navigate = useNavigate();

  if (lines.length === 0) {
    return (
      <div className="shop-page">
        <h1>Your cart</h1>
        <p className="shop-muted">Your cart is empty.</p>
        <Link to="/parts">Find parts</Link>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <h1>Your cart</h1>

      <ul className="cart-lines">
        {lines.map((line) => (
          <li key={line.productId} className="shop-card cart-line">
            {line.photoUrl ? (
              <img className="part-thumb" src={mediaUrl(line.photoUrl)} alt="" />
            ) : (
              <div className="part-thumb part-photo-empty" />
            )}
            <div className="cart-line-info">
              <Link to={`/parts/${line.productId}`}>{line.name}</Link>
              <p className="shop-muted">{line.partNumber}</p>
              <p>{formatMoney(line.unitPrice)} each</p>
            </div>
            <input
              className="shop-input qty-input"
              type="number"
              min={1}
              max={MAX_LINE_QUANTITY}
              aria-label={`Quantity of ${line.name}`}
              value={line.quantity}
              onChange={(e) => setQuantity(line.productId, Number(e.target.value) || 1)}
            />
            <p className="cart-line-total">{formatMoney(line.unitPrice * line.quantity)}</p>
            <button type="button" className="link-button" onClick={() => remove(line.productId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <p>
          Parts total: <strong>{formatMoney(total)}</strong>
        </p>
        <p className="shop-muted">
          The delivery fee and the final price are added at checkout. You pay in cash when the parcel arrives.
        </p>
        <Button onClick={() => navigate('/checkout')}>Go to checkout</Button>
      </div>
    </div>
  );
};
