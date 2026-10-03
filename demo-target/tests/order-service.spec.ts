import { describe, expect, it } from 'vitest';
import {
  canCancel,
  cancelOrder,
  OrderCancellationError,
  type Order,
  type OrderStatus,
} from '../src/order-service.js';

const orderWith = (status: OrderStatus): Order => ({ id: 'order-1', status });

describe('canCancel', () => {
  it('allows cancelling a NEW order', () => {
    expect(canCancel(orderWith('NEW'))).toBe(true);
  });

  it('allows cancelling a PROCESSING order', () => {
    expect(canCancel(orderWith('PROCESSING'))).toBe(true);
  });

  // Regression test for issue #3.
  it('blocks cancelling a SHIPPED order', () => {
    expect(canCancel(orderWith('SHIPPED'))).toBe(false);
  });

  it('blocks cancelling a CANCELLED order', () => {
    expect(canCancel(orderWith('CANCELLED'))).toBe(false);
  });
});

describe('cancelOrder', () => {
  it('returns a cancelled copy without mutating the original', () => {
    const order = orderWith('NEW');

    const cancelled = cancelOrder(order);

    expect(cancelled).toEqual({ id: 'order-1', status: 'CANCELLED' });
    expect(order.status).toBe('NEW');
  });

  // Regression test for issue #3.
  it('throws when the order is SHIPPED', () => {
    expect(() => cancelOrder(orderWith('SHIPPED'))).toThrow(OrderCancellationError);
  });

  it('throws when the order is already CANCELLED', () => {
    expect(() => cancelOrder(orderWith('CANCELLED'))).toThrow(OrderCancellationError);
  });
});
