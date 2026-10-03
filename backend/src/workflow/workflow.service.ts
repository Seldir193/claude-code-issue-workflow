import { fetchIssue, type IssueRef } from '../github/github.client';
import { workflowSeed } from './workflow.seed';
import type { IssueInfo, WorkflowSummary } from './workflow.types';

// Phase 2 ingests exactly one issue. Everything else in the summary is still seeded.
export const WORKFLOW_ISSUE: IssueRef = {
  owner: 'Seldir193',
  repo: 'claude-code-issue-workflow',
  number: 3,
};

export type IssueLoader = () => Promise<IssueInfo>;

export const loadIssueFromGitHub: IssueLoader = () =>
  fetchIssue(WORKFLOW_ISSUE, { token: process.env.GITHUB_TOKEN });

// Never rejects: if GitHub is unavailable the seeded issue is served and labelled as such.
export async function getWorkflowSummary(loadIssue: IssueLoader): Promise<WorkflowSummary> {
  try {
    return { ...workflowSeed, source: 'GITHUB', issue: await loadIssue() };
  } catch (error) {
    return {
      ...workflowSeed,
      ingestionError: error instanceof Error ? error.message : 'GitHub issue ingestion failed',
    };
  }
}
