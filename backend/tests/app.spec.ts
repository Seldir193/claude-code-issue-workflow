import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import type { IssueLoader } from '../src/workflow/workflow.service';
import type { IssueInfo, WorkflowSummary } from '../src/workflow/workflow.types';

// Never the real loader: these tests must not reach the network.
const githubIssue: IssueInfo = {
  number: 3,
  title: 'Order cancellation remains enabled after shipment',
  body: '## Problem',
  state: 'OPEN',
  labels: [],
};
const loadIssue: IssueLoader = async () => githubIssue;
const failingLoadIssue: IssueLoader = async () => {
  throw new Error('GitHub could not be reached');
};

const app = createApp({ loadIssue });

describe('GET /api/health', () => {
  it('reports the service as ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'issue-workflow-backend' });
  });
});

describe('GET /api/workflow-summary', () => {
  const load = async (target = app): Promise<WorkflowSummary> => {
    const response = await request(target).get('/api/workflow-summary').expect(200);
    return response.body as WorkflowSummary;
  };

  it('returns the GitHub issue in READY state', async () => {
    const summary = await load();

    expect(summary.status).toBe('READY');
    expect(summary.source).toBe('GITHUB');
    expect(summary.issue).toEqual(githubIssue);
    expect(summary).not.toHaveProperty('ingestionError');
  });

  it('falls back to the seeded issue when GitHub ingestion fails', async () => {
    const summary = await load(createApp({ loadIssue: failingLoadIssue }));

    expect(summary.source).toBe('SEED');
    expect(summary.ingestionError).toBe('GitHub could not be reached');
    expect(summary.issue.number).toBe(3);
    expect(summary.issue.labels).toEqual(['bug', 'orders']);
  });

  it('lists the plan steps and expected files', async () => {
    const summary = await load();

    expect(summary.plan.map((step) => step.title)).toEqual([
      'Locate cancellation rule',
      'Update shipped-order guard',
      'Add regression test',
    ]);
    expect(summary.filesChanged.map((file) => file.path)).toEqual([
      'src/order-service.ts',
      'tests/order-service.spec.ts',
    ]);
  });

  it('does not claim any work has run', async () => {
    const summary = await load();

    expect(summary.testResults.status).toBe('NOT_RUN');
    expect(summary.plan.every((step) => step.status === 'PENDING')).toBe(true);
    expect(summary.filesChanged.every((file) => file.status === 'PLANNED')).toBe(true);
    expect(summary.verification.checks.every((check) => check.status === 'PENDING')).toBe(true);
  });

  it('describes the expected outcome for every order status', async () => {
    const summary = await load();

    expect(summary.verification.checks.map((check) => [check.orderStatus, check.expected])).toEqual([
      ['NEW', 'ALLOWED'],
      ['PROCESSING', 'ALLOWED'],
      ['SHIPPED', 'BLOCKED'],
      ['CANCELLED', 'BLOCKED'],
    ]);
  });
});

describe('unknown routes', () => {
  it('responds with a JSON 404', async () => {
    const response = await request(app).get('/api/missing');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });
});
