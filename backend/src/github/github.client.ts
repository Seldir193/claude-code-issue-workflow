import type { IssueInfo } from '../workflow/workflow.types';

export interface IssueRef {
  owner: string;
  repo: string;
  number: number;
}

export interface FetchIssueOptions {
  token?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export class GitHubIssueError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'GitHubIssueError';
  }
}

const API_ROOT = 'https://api.github.com';

export function issueUrl(ref: IssueRef): string {
  return `${API_ROOT}/repos/${ref.owner}/${ref.repo}/issues/${ref.number}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// GitHub returns labels as objects, but the API also allows plain strings.
function labelName(label: unknown): string | undefined {
  if (typeof label === 'string') return label;
  if (isRecord(label) && typeof label.name === 'string') return label.name;
  return undefined;
}

export function toIssueInfo(payload: unknown): IssueInfo {
  if (!isRecord(payload)) {
    throw new GitHubIssueError('GitHub returned an unexpected issue payload');
  }
  // The issues endpoint also serves pull requests; those are not issues here.
  if ('pull_request' in payload) {
    throw new GitHubIssueError('GitHub returned a pull request, not an issue');
  }
  const { number, title, body, state, labels } = payload;
  if (
    typeof number !== 'number' ||
    typeof title !== 'string' ||
    (state !== 'open' && state !== 'closed')
  ) {
    throw new GitHubIssueError('GitHub returned an unexpected issue payload');
  }

  return {
    number,
    title,
    body: typeof body === 'string' ? body : '',
    state: state === 'open' ? 'OPEN' : 'CLOSED',
    labels: Array.isArray(labels)
      ? labels.map(labelName).filter((name): name is string => name !== undefined)
      : [],
  };
}

export async function fetchIssue(ref: IssueRef, options: FetchIssueOptions = {}): Promise<IssueInfo> {
  const { token, fetchImpl = fetch, timeoutMs = 5000 } = options;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'issue-workflow-backend',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetchImpl(issueUrl(ref), { headers, signal: AbortSignal.timeout(timeoutMs) });
  } catch {
    throw new GitHubIssueError('GitHub could not be reached');
  }
  if (!response.ok) {
    throw new GitHubIssueError(`GitHub responded with status ${response.status}`, response.status);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new GitHubIssueError('GitHub returned an unexpected issue payload');
  }
  return toIssueInfo(payload);
}
