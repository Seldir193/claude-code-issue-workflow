# demo-target

A deliberately tiny TypeScript codebase that models order cancellation rules. It is the target used by the issue-to-implementation workflow.

| Status | Cancel should be | Current behavior |
| --- | --- | --- |
| `NEW` | allowed | allowed |
| `PROCESSING` | allowed | allowed |
| `SHIPPED` | blocked | blocked |
| `CANCELLED` | blocked | blocked |

## Issue #3 fix

Issue #3 reported that shipped orders could still be cancelled. The root cause was `SHIPPED` being present in `CANCELLABLE_STATUSES`.

The fix removes `SHIPPED` from that allow-list. Regression tests verify both:

- `canCancel({ status: 'SHIPPED' })` returns `false`.
- `cancelOrder({ status: 'SHIPPED' })` throws `OrderCancellationError`.

The suite now contains 7 passing tests.

To verify the corrected behavior directly:

```bash
npx tsx -e "import('./src/order-service.ts').then(m => process.stdout.write(String(m.canCancel({ id: 'o1', status: 'SHIPPED' })) + '\\n'))"
```

It prints `false`.

## Commands

```bash
npm install
npm test
npm run typecheck
```
