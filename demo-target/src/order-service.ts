export type OrderStatus = 'NEW' | 'PROCESSING' | 'SHIPPED' | 'CANCELLED';

export interface Order {
  id: string;
  status: OrderStatus;
}

export class OrderCancellationError extends Error {
  constructor(order: Order) {
    super(`Order ${order.id} cannot be cancelled while ${order.status}`);
    this.name = 'OrderCancellationError';
  }
}

// INTENTIONAL DEMO BUG (issue #3): SHIPPED must not be cancellable.
// It is left in place so a later workflow run can find and fix it. See README.md.
const CANCELLABLE_STATUSES: readonly OrderStatus[] = ['NEW', 'PROCESSING', 'SHIPPED'];

export function canCancel(order: Order): boolean {
  return CANCELLABLE_STATUSES.includes(order.status);
}

export function cancelOrder(order: Order): Order {
  if (!canCancel(order)) {
    throw new OrderCancellationError(order);
  }
  return { ...order, status: 'CANCELLED' };
}
