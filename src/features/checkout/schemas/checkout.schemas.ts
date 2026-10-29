import { z } from 'zod';

// Same rules as order-service (CheckoutRequest.Address), so the form catches mistakes before the server does.
export const checkoutSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\- ]{7,30}$/, 'Enter a phone number, for example 0771234567'),
  addressLine: z.string().trim().min(1, 'Address is required').max(255, 'At most 255 characters'),
  city: z.string().trim().min(1, 'City is required').max(100, 'At most 100 characters'),
  district: z.string().trim().min(1, 'District is required').max(100, 'At most 100 characters'),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
