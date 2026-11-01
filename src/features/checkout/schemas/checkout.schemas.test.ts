import { describe, expect, it } from 'vitest';
import { checkoutSchema } from './checkout.schemas';

const good = { phone: '0771234567', addressLine: '12 Galle Road', city: 'Colombo', district: 'Colombo' };

describe('checkoutSchema (the same rules as order-service)', () => {
  it('accepts a normal address', () => {
    expect(checkoutSchema.safeParse(good).success).toBe(true);
  });

  it('accepts the usual ways of writing a phone number', () => {
    for (const phone of ['0771234567', '+94 77 123 4567', '(011) 234-5678', '077 123 4567']) {
      expect(checkoutSchema.safeParse({ ...good, phone }).success, phone).toBe(true);
    }
  });

  it('refuses a phone number with letters, or too short or too long', () => {
    for (const phone of ['abc', '12345', '0771234567x', '1'.repeat(31), '']) {
      expect(checkoutSchema.safeParse({ ...good, phone }).success, `"${phone}"`).toBe(false);
    }
  });

  it('trims spaces around the text fields', () => {
    const parsed = checkoutSchema.parse({ ...good, city: '  Kandy  ', addressLine: ' 5 Temple Road ' });
    expect(parsed.city).toBe('Kandy');
    expect(parsed.addressLine).toBe('5 Temple Road');
  });

  it('needs an address, a city and a district (spaces only do not count)', () => {
    for (const field of ['addressLine', 'city', 'district'] as const) {
      expect(checkoutSchema.safeParse({ ...good, [field]: '' }).success, field).toBe(false);
      expect(checkoutSchema.safeParse({ ...good, [field]: '   ' }).success, `${field} (spaces)`).toBe(false);
    }
  });

  it('keeps to the length limits of the service (address 255, city and district 100)', () => {
    expect(checkoutSchema.safeParse({ ...good, addressLine: 'a'.repeat(255) }).success).toBe(true);
    expect(checkoutSchema.safeParse({ ...good, addressLine: 'a'.repeat(256) }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...good, city: 'c'.repeat(101) }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...good, district: 'd'.repeat(101) }).success).toBe(false);
  });
});
