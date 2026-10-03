import { describe, expect, it, vi } from 'vitest';
import { fetchIssue, GitHubIssueError, type IssueRef } from '../src/github/github.client';

const ref: IssueRef = { owner: 'Seldir193', repo: 'claude-code-issue-workflow', number: 3 };

const issuePayload = {
  number: 3,
  title: 'Order cancellation remains enabled after shipment',
  body: '## Problem',
  state: 'open',
  labels: [{ id: 1, name: 'bug' }, 'orders'],
};

function fakeFetch(body: unknown, status = 200) {
  return vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }));
}

function sentHeaders(fetchImpl: ReturnType<typeof fakeFetch>): Record<string, string> {
  return fetchImpl.mock.calls[0][1]?.headers as Record<string, string>;
}

describe('fetchIssue', () => {
  it('requests the issue from the GitHub REST API', async () => {
    const fetchImpl = fakeFetch(issuePayload);

    await fetchIssue(ref, { fetchImpl });

    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0][0]).toBe(
      'https://api.github.com/repos/Seldir193/claude-code-issue-workflow/issues/3',
    );
    expect(sentHeaders(fetchImpl)).toEqual({
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'issue-workflow-backend',
    });
  });

  it('sends the token only when one is provided', async () => {
    const fetchImpl = fakeFetch(issuePayload);

    await fetchIssue(ref, { fetchImpl, token: 'test-token' });

    expect(sentHeaders(fetchImpl).Authorization).toBe('Bearer test-token');
  });

  it('maps the payload to the dashboard issue shape', async () => {
    const issue = await fetchIssue(ref, { fetchImpl: fakeFetch(issuePayload) });

    expect(issue).toEqual({
      number: 3,
      title: 'Order cancellation remains enabled after shipment',
      body: '## Problem',
      state: 'OPEN',
      labels: ['bug', 'orders'],
    });
  });

  it('maps a closed issue with no body and no labels', async () => {
    const fetchImpl = fakeFetch({ ...issuePayload, state: 'closed', body: null, labels: [] });

    const issue = await fetchIssue(ref, { fetchImpl });

    expect(issue.state).toBe('CLOSED');
    expect(issue.body).toBe('');
    expect(issue.labels).toEqual([]);
  });

  it.each([404, 403, 500])('throws when GitHub responds with %i', async (status) => {
    const fetchImpl = fakeFetch({ message: 'nope' }, status);

    await expect(fetchIssue(ref, { fetchImpl })).rejects.toMatchObject({
      name: 'GitHubIssueError',
      status,
      message: `GitHub responded with status ${status}`,
    });
  });

  it('throws when the request itself fails', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new TypeError('fetch failed');
    });

    await expect(fetchIssue(ref, { fetchImpl })).rejects.toThrow('GitHub could not be reached');
  });

  it('rejects a payload that is not an issue', async () => {
    const fetchImpl = fakeFetch({ number: '3', title: null });

    await expect(fetchIssue(ref, { fetchImpl })).rejects.toBeInstanceOf(GitHubIssueError);
  });

  it('rejects a response that is not JSON', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response('<html>', { status: 200 }));

    await expect(fetchIssue(ref, { fetchImpl })).rejects.toBeInstanceOf(GitHubIssueError);
  });

  it('rejects a pull request served by the issues endpoint', async () => {
    const fetchImpl = fakeFetch({ ...issuePayload, pull_request: { url: 'https://example.test' } });

    await expect(fetchIssue(ref, { fetchImpl })).rejects.toThrow('pull request');
  });
});
