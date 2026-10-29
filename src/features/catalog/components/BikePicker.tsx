import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '@/shared/hooks/useFetch';
import { catalogApi } from '../api/catalogApi';

// Step 1: choose a brand. Step 2: choose a model. Then show the parts that fit that model.
export const BikePicker = () => {
  const [brandId, setBrandId] = useState<number | null>(null);

  const loadBrands = useCallback(() => catalogApi.brands(), []);
  const brands = useFetch(loadBrands);

  const loadModels = useCallback(
    () => (brandId === null ? Promise.resolve([]) : catalogApi.models(brandId)),
    [brandId],
  );
  const models = useFetch(loadModels);

  return (
    <section className="shop-card">
      <h2>Find parts for your bike</h2>

      <label className="shop-label" htmlFor="brand">
        1. Brand
      </label>
      <select
        id="brand"
        className="shop-input"
        value={brandId ?? ''}
        onChange={(e) => setBrandId(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Choose a brand</option>
        {brands.data?.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      {brands.error && <p role="alert" className="shop-error">{brands.error}</p>}

      {brandId !== null && (
        <>
          <p className="shop-label">2. Model</p>
          {models.isLoading && <p className="shop-muted">Loading models...</p>}
          {models.error && <p role="alert" className="shop-error">{models.error}</p>}
          {!models.isLoading && models.data?.length === 0 && (
            <p className="shop-muted">No models for this brand yet.</p>
          )}
          <ul className="shop-chips">
            {models.data?.map((m) => (
              <li key={m.id}>
                <Link className="shop-chip" to={`/parts?bikeModelId=${m.id}`}>
                  {m.name}
                  {m.yearFrom ? ` (${m.yearFrom}${m.yearTo ? `-${m.yearTo}` : '+'})` : ''}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
