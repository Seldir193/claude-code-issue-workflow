# Claude Code in Action: Issue-to-Implementation Workflow

A small scaffold that shows how a GitHub issue becomes a verified code change:

```
GitHub Issue -> Codebase Analysis -> Implementation Plan -> Targeted Code Change
             -> Tests -> Verification -> Implementation Report
```

**Status: Phase 2 (GitHub issue ingestion).** The backend now reads Issue #3 from the real GitHub Issues API and feeds its number, title, body, state and labels into the dashboard. Analysis, implementation plan, expected files and verification criteria remain deliberately seeded, and no code is changed automatically yet.

> **Later phases** add bounded Claude Code execution against `demo-target`, real test execution results and the final verification report.

## Architecture

| Area           | Stack                              | Role                                                              |
| -------------- | ---------------------------------- | ----------------------------------------------------------------- |
| `frontend/`    | Angular (standalone), TypeScript, SCSS | Dashboard. Fetches `/api/workflow-summary`; layout works down to 325px. |
| `backend/`     | Node.js, Express, TypeScript       | `GET /api/health`, GitHub issue ingestion and typed `GET /api/workflow-summary`. |
| `demo-target/` | TypeScript, Vitest                 | Order cancellation rules the workflow will operate on.            |

The dashboard sections are Repository, Issue, Analysis, Implementation Plan, Files Changed, Test Results and Verification Report. In dev, the Angular server proxies `/api` to the backend; in Docker, nginx does.

The workflow types live in `backend/src/workflow/workflow.types.ts`. `frontend/src/app/workflow/workflow.types.ts` is a copy; keep the two in sync until a shared package is worth it.

### Live issue data is not an implementation result

When GitHub ingestion succeeds, `source` is `GITHUB` and only the issue block is live. The workflow remains `READY`, test results remain `NOT_RUN`, and every plan step and verification check stays `PENDING`. If GitHub is unavailable, the backend returns the seeded issue with `source: SEED` and an `ingestionError`; the dashboard makes that fallback explicit.

## The demo target and its intentional bug

`demo-target/src/order-service.ts` models orders with the statuses `NEW`, `PROCESSING`, `SHIPPED` and `CANCELLED`. It contains a **deliberate bug**: `SHIPPED` orders can still be cancelled. This is Issue #3, "Order cancellation remains enabled after shipment", and it is left in place so a later workflow run has something real to fix. See [demo-target/README.md](demo-target/README.md).

The baseline tests pass. The suite has no `SHIPPED` case: the `SHIPPED -> blocked` expectation exists only as a future verification criterion in the seed data, not as a passing test.

## Commands

Requires Node.js 24 and npm.

```bash
# Backend (http://localhost:3000)
cd backend
npm install
npm run dev        # watch mode
npm test
npm run lint
npm run build
# Optional for higher GitHub API rate limits or private-repo access:
# set GITHUB_TOKEN in the environment before starting the backend.

# Frontend (http://localhost:4200, proxies /api to :3000)
cd frontend
npm install
npm start
npm test -- --watch=false
npm run build

# Demo target
cd demo-target
npm install
npm test
npm run typecheck

# Both services in containers (frontend on http://localhost:8080,
# override with FRONTEND_PORT=<port>)
docker compose up --build
```

CI (`.github/workflows/ci.yml`) runs backend lint/test/build, frontend test/build, and the demo-target typecheck and tests.

## Scope and non-goals

In scope through Phase 2: the scaffold, real ingestion of the single bounded GitHub Issue #3, seeded analysis/planning data, tests, lint, Docker and CI.

Not in scope yet: Claude API or automated code execution, authentication, databases, queues, Kubernetes, subscriptions, multi-agent systems, or running arbitrary repositories.

## Phase 3 and beyond

- Bounded Claude Code execution against `demo-target` for Issue #3.
- Focused test execution after the targeted edit.
- Git diff review, real test results and verification fed back into the dashboard.

See [docs/learning-map.md](docs/learning-map.md) for how the completed phases map to the workflow skills this project demonstrates.
