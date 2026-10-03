# demo-target

A deliberately tiny TypeScript codebase that models order cancellation rules. It is the
*target* the issue workflow analyses and (in a later phase) changes.

| Status       | Cancel should be | Baseline behaviour |
| ------------ | ---------------- | ------------------ |
| `NEW`        | allowed          | allowed            |
| `PROCESSING` | allowed          | allowed            |
| `SHIPPED`    | blocked          | **allowed (bug)**  |
| `CANCELLED`  | blocked          | blocked            |

## Intentional bug

`src/order-service.ts` lists `SHIPPED` among the cancellable statuses. This is on purpose:
it is the defect described by seed issue #3, "Order cancellation remains enabled after
shipment". Do not fix it by hand; a later workflow run is meant to locate the rule,
update the guard, and add the regression test.

The baseline test suite passes and has no `SHIPPED` case. "SHIPPED -> cancel blocked"
exists in Phase 1 only as a verification criterion in the workflow seed data.

To see the bug:

```bash
npx tsx -e "import('./src/order-service.ts').then(m => process.stdout.write(String(m.canCancel({ id: 'o1', status: 'SHIPPED' })) + '\n'))"
```

It prints `true`; after the fix it must print `false`.

## Commands

```bash
npm install
npm test          # vitest run
npm run typecheck # tsc --noEmit
```
