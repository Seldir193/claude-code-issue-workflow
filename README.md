# Claude Code in Action: Issue-to-Implementation Workflow

A small portfolio project that demonstrates a complete issue-driven maintenance loop:

```
GitHub Issue -> Codebase Analysis -> Implementation Plan -> Targeted Code Change
             -> Focused Tests -> Verification -> Implementation Report
```

**Status: Phase 3 complete.** Issue #3 is ingested from the real GitHub Issues API, the order-cancellation defect has been fixed in `demo-target`, regression coverage was added, and the dashboard reports the completed implementation and verification evidence.

## Architecture

| Area | Stack | Role |
| --- | --- | --- |
| `frontend/` | Angular, TypeScript, SCSS | Dashboard for issue context, analysis, plan, changed files, tests and verification. |
| `backend/` | Node.js, Express, TypeScript | GitHub issue ingestion plus typed `GET /api/workflow-summary`. |
| `demo-target/` | TypeScript, Vitest | Tiny order service changed by Issue #3. |

The workflow types live in `backend/src/workflow/workflow.types.ts`. The frontend keeps the matching display contract in `frontend/src/app/workflow/workflow.types.ts`.

## Issue #3 result

The root cause was a single allow-list:

```ts
const CANCELLABLE_STATUSES = ['NEW', 'PROCESSING', 'SHIPPED'];
```

`SHIPPED` was removed, so only `NEW` and `PROCESSING` remain cancellable. Regression tests now prove that both `canCancel` and `cancelOrder` reject shipped orders.

Verified behavior:

| Status | Cancel |
| --- | --- |
| `NEW` | allowed |
| `PROCESSING` | allowed |
| `SHIPPED` | blocked |
| `CANCELLED` | blocked |

The focused `demo-target` verification passes **7/7 tests** and TypeScript typecheck.

## GitHub ingestion

The backend reads exactly `Seldir193/claude-code-issue-workflow#3` with native `fetch`. When ingestion succeeds, `source` is `GITHUB`. If GitHub is unavailable, fallback issue metadata is returned with `source: SEED` and an `ingestionError`; the completed Phase 3 implementation record remains available.

Tests inject fake fetch/load functions, so automated tests do not depend on the real network.

## Commands

Requires Node.js 24 and npm.

```bash
# Backend
cd backend
npm install
npm run lint
npm test
npm run build

# Frontend
cd frontend
npm install
npm test -- --watch=false
npm run build

# Demo target
cd demo-target
npm install
npm test
npm run typecheck

# Containers
docker compose up --build
```

CI runs backend lint/test/build, frontend test/build, and demo-target typecheck/tests.

## Scope and non-goals

Implemented through Phase 3: real GitHub issue ingestion, bounded codebase analysis, a minimal targeted fix, regression testing, verification reporting, Docker and CI.

Not included: Claude API integration, arbitrary repository execution, authentication, databases, queues, Kubernetes, subscriptions or multi-agent orchestration.

See [docs/learning-map.md](docs/learning-map.md) for the portfolio learning map.
