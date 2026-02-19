"use client";

import { createContext, useContext, useReducer, useMemo, useCallback, type ReactNode } from "react";
import { PRICES, SCENTS, type CandleSize } from "@/data/products";

export type CartItem = {
  scent: string;
  size: CandleSize;
  quantity: number;
};

type CartAction =
  | { type: "ADD_ITEM"; scent: string; size: CandleSize }
  | { type: "REMOVE_ITEM"; scent: string; size: CandleSize }
  | { type: "CHANGE_SIZE"; scent: string; fromSize: CandleSize; toSize: CandleSize }
  | { type: "CHANGE_QUANTITY"; scent: string; size: CandleSize; delta: number }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const idx = state.findIndex(
        (i) => i.scent === action.scent && i.size === action.size
      );
      if (idx >= 0) {
        return state.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...state, { scent: action.scent, size: action.size, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter(
        (i) => !(i.scent === action.scent && i.size === action.size)
      );
    case "CHANGE_SIZE": {
      if (action.fromSize === action.toSize) return state;
      const source = state.find(
        (i) => i.scent === action.scent && i.size === action.fromSize
      );
      if (!source) return state;
      const target = state.find(
        (i) => i.scent === action.scent && i.size === action.toSize
      );
      if (target) {
        return state
          .map((item) => {
            if (item.scent === action.scent && item.size === action.toSize) {
              return { ...item, quantity: item.quantity + source.quantity };
            }
            return item;
          })
          .filter((i) => !(i.scent === action.scent && i.size === action.fromSize));
      }
      return state.map((item) =>
        item.scent === action.scent && item.size === action.fromSize
          ? { ...item, size: action.toSize }
          : item
      );
    }
    case "CHANGE_QUANTITY":
      return state.map((item) =>
        item.scent === action.scent && item.size === action.size
          ? { ...item, quantity: Math.max(1, item.quantity + action.delta) }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  isInCart: (scent: string) => boolean;
  getItemsForScent: (scent: string) => CartItem[];
  getScentQuantity: (scent: string) => number;
  getScentImage: (scent: string) => string | undefined;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + PRICES[item.size] * item.quantity,
    0
  );

  const isInCart = useCallback(
    (scent: string) => items.some((i) => i.scent === scent),
    [items]
  );

  const getItemsForScent = useCallback(
    (scent: string) => items.filter((i) => i.scent === scent),
    [items]
  );

  const getScentQuantity = useCallback(
    (scent: string) =>
      items
        .filter((i) => i.scent === scent)
        .reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const getScentImage = useCallback(
    (scent: string) => SCENTS.find((s) => s.name === scent)?.image,
    []
  );

  const value = useMemo(
    () => ({
      items,
      dispatch,
      totalItems,
      totalPrice,
      isInCart,
      getItemsForScent,
      getScentQuantity,
      getScentImage,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isInCart,
      getItemsForScent,
      getScentQuantity,
      getScentImage,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export { PRICES, type CandleSize } from "@/data/products";
