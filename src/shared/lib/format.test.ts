import { describe, expect, it } from 'vitest';
import { formatDateTime, formatMoney, mediaUrl } from './format';

describe('formatMoney', () => {
  it('always shows two decimals, with the currency in front', () => {
    expect(formatMoney(3500)).toBe('LKR 3,500.00');
    expect(formatMoney(1250.5)).toBe('LKR 1,250.50');
    expect(formatMoney('9500.00')).toBe('LKR 9,500.00');
  });

  it('uses the currency it is given', () => {
    expect(formatMoney(10, 'USD')).toBe('USD 10.00');
  });
});

describe('formatDateTime', () => {
  it('shows nothing for a missing time', () => {
    expect(formatDateTime(null)).toBe('');
    expect(formatDateTime(undefined)).toBe('');
  });

  it('shows something readable for a real time', () => {
    expect(formatDateTime('2026-10-19T08:30:00Z')).toMatch(/2026/);
  });
});

describe('mediaUrl', () => {
  it('returns nothing when there is no photo', () => {
    expect(mediaUrl(null)).toBeUndefined();
    expect(mediaUrl('')).toBeUndefined();
  });

  it('leaves a full address as it is', () => {
    expect(mediaUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg');
  });

  it('puts the site address in front of a relative path, without a double slash', () => {
    const base = String(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
    expect(mediaUrl('/media/products/1/a.jpg')).toBe(`${base}/media/products/1/a.jpg`);
  });
});
