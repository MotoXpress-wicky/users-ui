import { describe, expect, it } from 'vitest';
import { STATUS_TEXT } from './order.types';

describe('STATUS_TEXT (what the customer reads)', () => {
  it('has a word for every shipment status, and no other', () => {
    expect(Object.keys(STATUS_TEXT).sort()).toEqual(['CANCELLED', 'DELIVERED', 'IN_TRANSIT', 'NOT_SHIPPED', 'RETURNED']);
  });

  it('uses the words of the design', () => {
    expect(STATUS_TEXT.NOT_SHIPPED).toBe('Order placed');
    expect(STATUS_TEXT.IN_TRANSIT).toBe('Shipped');
    expect(STATUS_TEXT.DELIVERED).toBe('Delivered');
    expect(STATUS_TEXT.RETURNED).toBe('Returned to us');
    expect(STATUS_TEXT.CANCELLED).toBe('Cancelled');
  });

  it('never shows a payment word: the customer pays at the door and never sees the payment status', () => {
    for (const text of Object.values(STATUS_TEXT)) {
      expect(text).not.toMatch(/paid|pending|collected|payment/i);
    }
  });
});
