import { useCallback, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '@/shared/hooks/useFetch';
import { Button } from '@/shared/components/Button';
import { catalogApi } from '../api/catalogApi';
import { PartCard } from '../components/PartCard';

const PAGE_SIZE = 12;

// The filters live in the address (?q=...&categoryId=...&bikeModelId=...&page=...),
// so a search can be shared and the back button works.
export const PartsPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const categoryId = params.get('categoryId');
  const bikeModelId = params.get('bikeModelId');
  const page = Number(params.get('page') ?? '0');

  const [text, setText] = useState(q);

  const loadCategories = useCallback(() => catalogApi.categories(), []);
  const categories = useFetch(loadCategories);

  const loadParts = useCallback(
    () =>
      catalogApi.search({
        q: q || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        bikeModelId: bikeModelId ? Number(bikeModelId) : undefined,
        page,
        size: PAGE_SIZE,
      }),
    [q, categoryId, bikeModelId, page],
  );
  const parts = useFetch(loadParts);

  // Change one filter, keep the others, go back to the first page.
  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const goToPage = (target: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(target));
    setParams(next);
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setFilter('q', text.trim());
  };

  const result = parts.data;

  return (
    <div className="shop-page">
      <h1>Parts</h1>

      <form className="shop-filters" onSubmit={onSearch}>
        <input
          className="shop-input"
          type="search"
          placeholder="Part number or name"
          aria-label="Search parts"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          className="shop-input"
          aria-label="Category"
          value={categoryId ?? ''}
          onChange={(e) => setFilter('categoryId', e.target.value)}
        >
          <option value="">All categories</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button type="submit">Search</Button>
      </form>

      {bikeModelId && (
        <p className="shop-muted">
          Showing parts that fit your bike.{' '}
          <button type="button" className="link-button" onClick={() => setFilter('bikeModelId', '')}>
            Show all parts
          </button>
        </p>
      )}

      {parts.isLoading && <p className="shop-muted">Loading parts...</p>}
      {parts.error && <p role="alert" className="shop-error">{parts.error}</p>}
      {result && result.content.length === 0 && <p className="shop-muted">No parts found.</p>}

      <ul className="part-grid">
        {result?.content.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </ul>

      {result && result.totalPages > 1 && (
        <nav className="shop-pager" aria-label="Pages">
          <Button variant="secondary" disabled={page <= 0} onClick={() => goToPage(page - 1)}>
            Previous
          </Button>
          <span>
            Page {result.page + 1} of {result.totalPages}
          </span>
          <Button variant="secondary" disabled={page + 1 >= result.totalPages} onClick={() => goToPage(page + 1)}>
            Next
          </Button>
        </nav>
      )}
    </div>
  );
};
