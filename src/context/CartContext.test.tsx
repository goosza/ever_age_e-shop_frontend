import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CartProvider } from './CartContext';
import { useCart } from './cartContextDef';
import type { CartItem } from './cartContextDef';

const item1: CartItem = { id: '1', title: 'Product 1', price: 10, qty: 1 };
const item2: CartItem = { id: '2', title: 'Product 2', price: 20, qty: 2 };

// Small test harness component exposing the cart API to the test via a ref-like callback.
function TestHarness({ onReady }: { onReady: (cart: ReturnType<typeof useCart>) => void }) {
  const cart = useCart();
  onReady(cart);
  return (
    <div>
      <span data-testid="item-count">{cart.itemCount}</span>
      <span data-testid="total">{cart.total}</span>
    </div>
  );
}

function renderCart() {
  let cart!: ReturnType<typeof useCart>;
  render(
    <CartProvider>
      <TestHarness onReady={(c) => (cart = c)} />
    </CartProvider>
  );
  return () => cart;
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty when localStorage has no cart', () => {
    const getCart = renderCart();
    expect(getCart().items).toEqual([]);
    expect(getCart().itemCount).toBe(0);
    expect(getCart().total).toBe(0);
  });

  it('restores cart from localStorage on mount', () => {
    localStorage.setItem('cart', JSON.stringify([item1]));
    const getCart = renderCart();
    expect(getCart().items).toEqual([item1]);
  });

  it('ignores corrupted localStorage data instead of throwing', () => {
    localStorage.setItem('cart', '{not valid json');
    const getCart = renderCart();
    expect(getCart().items).toEqual([]);
  });

  it('adds a new item to the cart', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item1));
    expect(getCart().items).toEqual([item1]);
    expect(screen.getByTestId('item-count').textContent).toBe('1');
  });

  it('increases quantity when adding an item that already exists', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item1));
    act(() => getCart().addItem({ ...item1, qty: 2 }));
    expect(getCart().items).toHaveLength(1);
    expect(getCart().items[0].qty).toBe(3);
  });

  it('removes an item from the cart', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item1));
    act(() => getCart().addItem(item2));
    act(() => getCart().removeItem(item1.id));
    expect(getCart().items).toEqual([item2]);
  });

  it('updates item quantity', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item1));
    act(() => getCart().updateItemQuantity(item1.id, 5));
    expect(getCart().items[0].qty).toBe(5);
  });

  it('removes the item when quantity is updated to zero or less', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item1));
    act(() => getCart().updateItemQuantity(item1.id, 0));
    expect(getCart().items).toEqual([]);
  });

  it('clears the cart', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item1));
    act(() => getCart().addItem(item2));
    act(() => getCart().clearCart());
    expect(getCart().items).toEqual([]);
  });

  it('computes itemCount and total across multiple items', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item1)); // 1 x 10 = 10
    act(() => getCart().addItem(item2)); // 2 x 20 = 40
    expect(getCart().itemCount).toBe(3);
    expect(getCart().total).toBe(50);
    expect(screen.getByTestId('total').textContent).toBe('50');
  });

  it('persists cart state to localStorage', () => {
    const getCart = renderCart();
    act(() => getCart().addItem(item1));
    const stored = JSON.parse(localStorage.getItem('cart') ?? '[]');
    expect(stored).toEqual([item1]);
  });
});
