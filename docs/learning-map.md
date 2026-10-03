# Learning map

How Phases 1 and 2 map to the practices this project is meant to demonstrate.

| Practice | Where it shows up |
| -------- | ----------------- |
| Codebase exploration | The **Analysis** section lists findings by file and symbol (`CANCELLABLE_STATUSES`, `canCancel`) in `demo-target`. |
| Context gathering | The **Repository** and **Issue** sections capture what the workflow knows before it plans. Since Phase 2 the issue text is read from the GitHub Issues API (`backend/src/github/github.client.ts`) rather than typed into the seed. |
| Planning before implementation | The **Implementation Plan** section has three ordered steps (locate the rule, update the guard, add a regression test), all `PENDING`. Nothing is edited until a plan exists. |
| Targeted editing | **Files Changed** names only `src/order-service.ts` and `tests/order-service.spec.ts`, both `PLANNED`. The fix is one allow-list entry plus one test. Phase 2 itself leaves `demo-target` untouched. |
| Testing | `demo-target` has a passing baseline suite. The SHIPPED case is deliberately absent, so the regression test is part of the future fix. The Phase 2 GitHub client, service and endpoint are tested with an injected fake `fetch` / issue loader, so no test reaches the network. |
| Verification | The **Verification Report** lists the four expected outcomes: NEW allowed, PROCESSING allowed, SHIPPED blocked, CANCELLED blocked. All are `PENDING` until a run confirms them. |
| Git diff review | Each phase is committed as a single commit after reviewing the diff. Later phases will report the diff of each targeted change. |
| Issue-driven development | Everything is organised around Issue #3, "Order cancellation remains enabled after shipment", from analysis through the final report. |

## Phase 2: what changed

- **One bounded integration.** The backend reads exactly one issue, `Seldir193/claude-code-issue-workflow#3`, with native `fetch`. There is no GitHub SDK, no write access and no other endpoint.
- **A seam for tests.** `createApp({ loadIssue })` takes the issue loader as a dependency and `fetchIssue` takes a `fetchImpl`, so behaviour is verified without the real network.
- **Untrusted input is validated.** The client checks the response status and the payload shape, maps GitHub's `open`/`closed` and label objects onto the dashboard's `IssueInfo`, and rejects pull requests served by the issues endpoint.
- **Honest failure.** If GitHub is unreachable or rate limited, the endpoint still answers with the seeded issue, `source: "SEED"` and an `ingestionError`. The dashboard banner says which of the two it is showing.

## What is real and what is seeded

- Real: the backend API, the dashboard, the demo codebase and its tests, Docker and CI, and (when `source` is `GITHUB`) the issue number, title, body, state and labels.
- Seeded: the repository description, analysis, plan, files and verification. A later phase replaces these with bounded Claude Code execution.
