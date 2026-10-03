import type { WorkflowSummary } from './workflow.types';

// Phase 1 seed data. Nothing here has been executed: the workflow is READY,
// so tests are NOT_RUN and every verification check is PENDING.
export const workflowSeed: WorkflowSummary = {
  id: 'wf-issue-3',
  status: 'READY',
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
      'The cancellation rule lives in a single allow-list. SHIPPED is part of that list, so shipped orders pass the guard.',
    findings: [
      {
        file: 'src/order-service.ts',
        symbol: 'CANCELLABLE_STATUSES',
        note: 'Allow-list includes SHIPPED alongside NEW and PROCESSING.',
      },
      {
        file: 'src/order-service.ts',
        symbol: 'canCancel',
        note: 'Only reads the allow-list, so fixing the list fixes cancelOrder too.',
      },
      {
        file: 'tests/order-service.spec.ts',
        symbol: 'canCancel suite',
        note: 'Covers NEW, PROCESSING and CANCELLED. SHIPPED is only a todo.',
      },
    ],
  },
  plan: [
    {
      order: 1,
      title: 'Locate cancellation rule',
      detail: 'Confirm CANCELLABLE_STATUSES is the only place the rule is defined.',
      status: 'PENDING',
    },
    {
      order: 2,
      title: 'Update shipped-order guard',
      detail: 'Remove SHIPPED from the allow-list so canCancel returns false.',
      status: 'PENDING',
    },
    {
      order: 3,
      title: 'Add regression test',
      detail: 'Replace the SHIPPED todo with an assertion that cancellation is blocked.',
      status: 'PENDING',
    },
  ],
  filesChanged: [
    {
      path: 'src/order-service.ts',
      reason: 'Holds the cancellation allow-list.',
      status: 'PLANNED',
    },
    {
      path: 'tests/order-service.spec.ts',
      reason: 'Needs the SHIPPED regression test.',
      status: 'PLANNED',
    },
  ],
  testResults: {
    status: 'NOT_RUN',
    command: 'npm test',
    note: 'No workflow run has executed yet, so there are no results to report.',
  },
  verification: {
    status: 'PENDING',
    summary: 'Checks to confirm once the fix has been applied and the tests have run.',
    checks: [
      { orderStatus: 'NEW', expected: 'ALLOWED', status: 'PENDING' },
      { orderStatus: 'PROCESSING', expected: 'ALLOWED', status: 'PENDING' },
      { orderStatus: 'SHIPPED', expected: 'BLOCKED', status: 'PENDING' },
      { orderStatus: 'CANCELLED', expected: 'BLOCKED', status: 'PENDING' },
    ],
  },
};
