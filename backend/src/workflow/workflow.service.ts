import { fetchIssue, type IssueRef } from '../github/github.client';
import { workflowSeed } from './workflow.seed';
import type { IssueInfo, WorkflowSummary } from './workflow.types';

// GitHub supplies issue metadata; the rest is the recorded Phase 3 execution result.
export const WORKFLOW_ISSUE: IssueRef = {
  owner: 'Seldir193',
  repo: 'claude-code-issue-workflow',
  number: 3,
};

export type IssueLoader = () => Promise<IssueInfo>;

export const loadIssueFromGitHub: IssueLoader = () =>
  fetchIssue(WORKFLOW_ISSUE, { token: process.env.GITHUB_TOKEN });

// Never rejects: if GitHub is unavailable fallback issue metadata is served and labelled as such.
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
