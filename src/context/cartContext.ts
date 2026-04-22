import { createContext, useContext } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, qty: number) => void;
  itemCount: number;
  total: number;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
