import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/shared/components/Button';
import { useFetch } from '@/shared/hooks/useFetch';
import { formatMoney, mediaUrl } from '@/shared/lib/format';
import { useCartStore } from '@/features/cart/stores/cartStore';
import { catalogApi } from '../api/catalogApi';

export const PartDetailPage = () => {
  const { id } = useParams();
  const partId = Number(id);

  const load = useCallback(() => catalogApi.product(partId), [partId]);
  const { data: part, error, isLoading } = useFetch(load);

  const addToCart = useCartStore((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (isLoading) return <p className="shop-page shop-muted">Loading...</p>;
  if (error || !part) {
    return (
      <div className="shop-page">
        <p role="alert" className="shop-error">{error ?? 'Part not found.'}</p>
        <Link to="/parts">Back to parts</Link>
      </div>
    );
  }

  const photo = part.photos[photoIndex] ?? part.photos[0];
  const maxQuantity = Math.max(1, part.stockQty);

  const onAdd = () => {
    addToCart(
      {
        productId: part.id,
        partNumber: part.partNumber,
        name: part.name,
        unitPrice: part.price,
        photoUrl: part.photos[0]?.url ?? null,
      },
      quantity,
    );
    toast.success(`${part.name} added to your cart`);
  };

  return (
    <div className="shop-page">
      <p>
        <Link to="/parts">&larr; All parts</Link>
      </p>

      <div className="part-detail">
        <div>
          {photo ? (
            <img className="part-photo-large" src={mediaUrl(photo.url)} alt={part.name} />
          ) : (
            <div className="part-photo-large part-photo-empty">No photo</div>
          )}
          {part.photos.length > 1 && (
            <ul className="part-thumbs">
              {part.photos.map((p, i) => (
                <li key={p.id}>
                  <button type="button" className="link-button" onClick={() => setPhotoIndex(i)} aria-label={`Photo ${i + 1}`}>
                    <img className="part-thumb" src={mediaUrl(p.url)} alt="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h1 className="part-title">{part.name}</h1>
          <p className="shop-muted">
            Part number {part.partNumber}
            {part.partBrand ? ` · ${part.partBrand}` : ''}
            {part.category ? ` · ${part.category.name}` : ''}
            {` · ${part.condition.toLowerCase()}`}
          </p>
          <p className="part-price part-price-large">{formatMoney(part.price)}</p>
          <p className={part.inStock ? 'badge badge-ok' : 'badge badge-no'}>
            {part.inStock ? `In stock (${part.stockQty})` : 'Out of stock'}
          </p>

          {part.inStock && (
            <div className="shop-row">
              <label className="shop-label" htmlFor="qty">
                Quantity
              </label>
              <input
                id="qty"
                className="shop-input qty-input"
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, Number(e.target.value) || 1)))}
              />
              <Button onClick={onAdd}>Add to cart</Button>
            </div>
          )}

          {part.description && <p className="part-description">{part.description}</p>}

          <h2>Fits these bikes</h2>
          {part.universalFit && <p className="shop-muted">This part fits every bike.</p>}
          {!part.universalFit && part.bikes.length === 0 && <p className="shop-muted">No bikes listed.</p>}
          <ul className="shop-chips">
            {part.bikes.map((b) => (
              <li key={b.id}>
                <Link className="shop-chip" to={`/parts?bikeModelId=${b.id}`}>
                  {b.brand} {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
