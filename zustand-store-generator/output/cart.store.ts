import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      immer((set) => ({
        items: [],
        isOpen: false,

        addItem: (item) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
              existing.quantity += 1;
            } else {
              state.items.push({ ...item, quantity: 1 });
            }
          }),

        removeItem: (id) =>
          set((state) => {
            state.items = state.items.filter((i) => i.id !== id);
          }),

        updateQuantity: (id, quantity) =>
          set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (item) {
              if (quantity <= 0) {
                state.items = state.items.filter((i) => i.id !== id);
              } else {
                item.quantity = quantity;
              }
            }
          }),

        clearCart: () => set({ items: [] }),
        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      })),
      { name: 'cart-storage' }
    ),
    { name: 'CartStore' }
  )
);

// Selectors
export const useCartItems = () => useCartStore((s) => s.items);
export const useCartTotal = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
