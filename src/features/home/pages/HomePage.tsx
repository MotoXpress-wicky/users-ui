import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { BikePicker } from '@/features/catalog/components/BikePicker';

// Public home page (BR1): anyone can look for parts. A login is needed only to order.
export const HomePage = () => {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = text.trim();
    navigate(q ? `/parts?q=${encodeURIComponent(q)}` : '/parts');
  };

  return (
    <div className="shop-page">
      <h1>Motorbike parts, delivered to your door</h1>
      <p className="shop-muted">Pay in cash when your parcel arrives.</p>

      <form className="shop-filters" onSubmit={onSearch}>
        <input
          className="shop-input"
          type="search"
          placeholder="Search by part number or name"
          aria-label="Search parts"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      <BikePicker />
    </div>
  );
};
