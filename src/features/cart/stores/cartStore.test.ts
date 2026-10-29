import { beforeEach, describe, expect, it, vi } from 'vitest';

// The store saves the cart in localStorage. Tests run in Node, which has none, so give it a small one first.
vi.hoisted(() => {
  const data = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: () => null,
    length: 0,
  } as Storage;
});

import { MAX_LINE_QUANTITY, selectCartCount, selectCartTotal, useCartStore } from './cartStore';

const pad = { productId: 1, partNumber: 'BP-1001', name: 'Front brake pad set', unitPrice: 3500, photoUrl: null };
const filter = { productId: 2, partNumber: 'OF-2002', name: 'Oil filter', unitPrice: 1250.5, photoUrl: null };

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ lines: [] });
  });

  it('adds a new line with the given quantity (default 1)', () => {
    useCartStore.getState().add(pad);
    useCartStore.getState().add(filter, 3);

    expect(useCartStore.getState().lines.map((l) => [l.productId, l.quantity])).toEqual([
      [1, 1],
      [2, 3],
    ]);
  });

  it('adding the same part again adds to its quantity, not a second line', () => {
    useCartStore.getState().add(pad, 2);
    useCartStore.getState().add(pad, 3);

    expect(useCartStore.getState().lines).toHaveLength(1);
    expect(useCartStore.getState().lines[0].quantity).toBe(5);
  });

  it('adding the same part again refreshes the price hint', () => {
    useCartStore.getState().add(pad);
    useCartStore.getState().add({ ...pad, unitPrice: 3600 });

    expect(useCartStore.getState().lines[0].unitPrice).toBe(3600);
  });

  it('keeps every quantity between 1 and the limit that order-service accepts', () => {
    useCartStore.getState().add(pad, 0);
    expect(useCartStore.getState().lines[0].quantity).toBe(1);

    useCartStore.getState().setQuantity(1, -4);
    expect(useCartStore.getState().lines[0].quantity).toBe(1);

    useCartStore.getState().setQuantity(1, 99999);
    expect(useCartStore.getState().lines[0].quantity).toBe(MAX_LINE_QUANTITY);

    useCartStore.getState().add(pad, 5);
    expect(useCartStore.getState().lines[0].quantity).toBe(MAX_LINE_QUANTITY);
  });

  it('rounds a quantity down to a whole number', () => {
    useCartStore.getState().add(pad);
    useCartStore.getState().setQuantity(1, 2.9);

    expect(useCartStore.getState().lines[0].quantity).toBe(2);
  });

  it('removes one line and clears all', () => {
    useCartStore.getState().add(pad);
    useCartStore.getState().add(filter);

    useCartStore.getState().remove(1);
    expect(useCartStore.getState().lines.map((l) => l.productId)).toEqual([2]);

    useCartStore.getState().clear();
    expect(useCartStore.getState().lines).toEqual([]);
  });

  it('counts the items and adds up the total', () => {
    useCartStore.getState().add(pad, 2); // 7000
    useCartStore.getState().add(filter, 1); // 1250.5

    expect(selectCartCount(useCartStore.getState())).toBe(3);
    expect(selectCartTotal(useCartStore.getState())).toBeCloseTo(8250.5, 2);
  });
});
