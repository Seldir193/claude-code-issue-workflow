import { describe, expect, it } from 'vitest';
import { GitHubIssueError } from '../src/github/github.client';
import { workflowSeed } from '../src/workflow/workflow.seed';
import { getWorkflowSummary, WORKFLOW_ISSUE } from '../src/workflow/workflow.service';
import type { IssueInfo } from '../src/workflow/workflow.types';

const githubIssue: IssueInfo = {
  number: 3,
  title: 'Title from GitHub',
  body: 'Body from GitHub',
  state: 'CLOSED',
  labels: ['bug'],
};

describe('getWorkflowSummary', () => {
  it('targets issue #3 of the workflow repository', () => {
    expect(WORKFLOW_ISSUE).toEqual({
      owner: 'Seldir193',
      repo: 'claude-code-issue-workflow',
      number: 3,
    });
  });

  it('replaces only the issue block when GitHub responds', async () => {
    const summary = await getWorkflowSummary(async () => githubIssue);

    expect(summary).toEqual({ ...workflowSeed, source: 'GITHUB', issue: githubIssue });
    expect(summary.ingestionError).toBeUndefined();
  });

  it('falls back to the seeded issue and reports why', async () => {
    const summary = await getWorkflowSummary(async () => {
      throw new GitHubIssueError('GitHub responded with status 403', 403);
    });

    expect(summary).toEqual({
      ...workflowSeed,
      ingestionError: 'GitHub responded with status 403',
    });
    expect(summary.source).toBe('SEED');
  });
});
