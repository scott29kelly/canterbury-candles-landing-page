export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

type GtagParams = Record<string, string | number | boolean | undefined>;

export function event(name: string, params?: GtagParams) {
  if (!GA_MEASUREMENT_ID) return;
  window.gtag("event", name, params);
}

// --- Scents ---

export function selectItem(itemId: string) {
  event("select_item", { item_id: itemId });
}

export function addToCart(itemId: string, itemVariant: string, price: number) {
  event("add_to_cart", { item_id: itemId, item_variant: itemVariant, price, quantity: 1 });
}

export function removeFromCart(itemId: string, itemVariant: string) {
  event("remove_from_cart", { item_id: itemId, item_variant: itemVariant });
}

export function soldOutClick(itemId: string) {
  event("sold_out_click", { item_id: itemId });
}

// --- Order ---

export function beginCheckout(value: number, itemCount: number) {
  event("begin_checkout", { value, items: itemCount });
}

export function purchase(value: number, cartSummary: string) {
  event("purchase", { value, currency: "USD", items: cartSummary });
}

export function orderError(errorMessage: string) {
  event("order_error", { error_message: errorMessage });
}

export function reorderClick() {
  event("reorder_click");
}

// --- Cart edits ---

export function changeItemSize(itemId: string, from: string, to: string) {
  event("change_item_size", { item_id: itemId, from, to });
}

// --- CTA / Nav ---

export function ctaClick(label: string) {
  event("cta_click", { label });
}

export function navClick(label: string) {
  event("nav_click", { label });
}

export function mobileMenu(action: "open" | "close") {
  event("mobile_menu", { action });
}
