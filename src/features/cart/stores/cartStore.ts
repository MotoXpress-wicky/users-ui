import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The cart lives in the browser (decision 37). Prices here are only a hint:
// order-service decides the real price at checkout.
export interface CartLine {
  productId: number;
  partNumber: string;
  name: string;
  unitPrice: number;
  quantity: number;
  photoUrl: string | null;
}

// order-service accepts 1..1000 for one line.
export const MAX_LINE_QUANTITY = 1000;

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const clamp = (quantity: number) => Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.floor(quantity)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],

      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === line.productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId
                  ? { ...l, ...line, quantity: clamp(l.quantity + quantity) }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, quantity: clamp(quantity) }] };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.productId === productId ? { ...l, quantity: clamp(quantity) } : l)),
        })),

      remove: (productId) => set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

      clear: () => set({ lines: [] }),
    }),
    { name: 'motoxpress-cart' },
  ),
);

export const selectCartCount = (state: CartState) => state.lines.reduce((sum, l) => sum + l.quantity, 0);

export const selectCartTotal = (state: CartState) =>
  state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
