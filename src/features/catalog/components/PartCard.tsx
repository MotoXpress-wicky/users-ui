import { Link } from 'react-router-dom';
import { formatMoney, mediaUrl } from '@/shared/lib/format';
import type { ProductSummary } from '../types/catalog.types';

export const PartCard = ({ part }: { part: ProductSummary }) => (
  <li className="shop-card part-card">
    <Link to={`/parts/${part.id}`} className="part-link">
      {part.photoUrl ? (
        <img className="part-photo" src={mediaUrl(part.photoUrl)} alt={part.name} loading="lazy" />
      ) : (
        <div className="part-photo part-photo-empty">No photo</div>
      )}
      <h3 className="part-name">{part.name}</h3>
    </Link>
    <p className="shop-muted">{part.partNumber}</p>
    <p className="part-price">{formatMoney(part.price)}</p>
    <p className={part.inStock ? 'badge badge-ok' : 'badge badge-no'}>
      {part.inStock ? 'In stock' : 'Out of stock'}
    </p>
  </li>
);
