import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Listing } from '../services/listingService';

export interface CartItem {
  listing: Listing;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (listing: Listing) => void;
  removeItem: (listingId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (listing: Listing) => {
    setItems(prev => {
      const existing = prev.find(item => item.listing.id === listing.id);
      if (existing) {
        return prev.map(item =>
          item.listing.id === listing.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { listing, quantity: 1 }];
    });
  };

  const removeItem = (listingId: string) => {
    setItems(prev => prev.filter(item => item.listing.id !== listingId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.listing.pricePerDay * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
