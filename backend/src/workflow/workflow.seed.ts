import type { WorkflowSummary } from './workflow.types';

export const workflowSeed: WorkflowSummary = {
  id: 'wf-issue-3',
  status: 'COMPLETE',
  source: 'SEED',
  repository: {
    name: 'demo-target',
    path: 'demo-target',
    language: 'TypeScript',
    defaultBranch: 'main',
    description: 'Tiny order service that models when an order may be cancelled.',
  },
  issue: {
    number: 3,
    title: 'Order cancellation remains enabled after shipment',
    body: 'An order that has already shipped can still be cancelled. Cancellation should only be possible while the order is NEW or PROCESSING.',
    state: 'OPEN',
    labels: ['bug', 'orders'],
  },
  analysis: {
    summary:
      'The cancellation rule used one allow-list. SHIPPED was incorrectly included, so both canCancel and cancelOrder treated shipped orders as cancellable.',
    findings: [
      {
        file: 'src/order-service.ts',
        symbol: 'CANCELLABLE_STATUSES',
        note: 'Root cause confirmed: SHIPPED was in the allow-list. The list now contains only NEW and PROCESSING.',
      },
      {
        file: 'src/order-service.ts',
        symbol: 'canCancel',
        note: 'canCancel reads only the allow-list, so the targeted list change also protects cancelOrder.',
      },
      {
        file: 'tests/order-service.spec.ts',
        symbol: 'SHIPPED regression coverage',
        note: 'Regression tests now verify both canCancel and cancelOrder block SHIPPED orders.',
      },
    ],
  },
  plan: [
    {
      order: 1,
      title: 'Locate cancellation rule',
      detail: 'Confirmed CANCELLABLE_STATUSES is the single rule used by canCancel and cancelOrder.',
      status: 'DONE',
    },
    {
      order: 2,
      title: 'Update shipped-order guard',
      detail: 'Removed SHIPPED from the allow-list while preserving NEW and PROCESSING.',
      status: 'DONE',
    },
    {
      order: 3,
      title: 'Add regression test',
      detail: 'Added SHIPPED regression coverage for canCancel and cancelOrder.',
      status: 'DONE',
    },
  ],
  filesChanged: [
    {
      path: 'src/order-service.ts',
      reason: 'Removed SHIPPED from the cancellation allow-list.',
      status: 'CHANGED',
    },
    {
      path: 'tests/order-service.spec.ts',
      reason: 'Added regression coverage proving SHIPPED cancellation is blocked.',
      status: 'CHANGED',
    },
  ],
  testResults: {
    status: 'PASSED',
    command: 'npm test && npm run typecheck',
    note: 'Vitest passed 7/7 tests and the TypeScript typecheck completed successfully.',
  },
  verification: {
    status: 'VERIFIED',
    summary: 'Issue #3 is fixed and every expected cancellation outcome is verified.',
    checks: [
      { orderStatus: 'NEW', expected: 'ALLOWED', status: 'VERIFIED' },
      { orderStatus: 'PROCESSING', expected: 'ALLOWED', status: 'VERIFIED' },
      { orderStatus: 'SHIPPED', expected: 'BLOCKED', status: 'VERIFIED' },
      { orderStatus: 'CANCELLED', expected: 'BLOCKED', status: 'VERIFIED' },
    ],
  },
};
