# Claude Code in Action: Issue-to-Implementation Workflow

A small scaffold that shows how a GitHub issue becomes a verified code change:

```
GitHub Issue -> Codebase Analysis -> Implementation Plan -> Targeted Code Change
             -> Tests -> Verification -> Implementation Report
```

**Status: Phase 1 (scaffold).** The dashboard renders seeded, mock workflow data for Issue #3 against a tiny demo codebase. Nothing is fetched from GitHub and no code is changed automatically yet.

> **Later phases** add GitHub issue ingestion and bounded Claude Code execution. Neither exists in Phase 1.

## Architecture

| Area           | Stack                              | Role                                                              |
| -------------- | ---------------------------------- | ----------------------------------------------------------------- |
| `frontend/`    | Angular (standalone), TypeScript, SCSS | Dashboard. Fetches `/api/workflow-summary`; layout works down to 325px. |
| `backend/`     | Node.js, Express, TypeScript       | `GET /api/health` and typed `GET /api/workflow-summary` (seed data). |
| `demo-target/` | TypeScript, Vitest                 | Order cancellation rules the workflow will operate on.            |

The dashboard sections are Repository, Issue, Analysis, Implementation Plan, Files Changed, Test Results and Verification Report. In dev, the Angular server proxies `/api` to the backend; in Docker, nginx does.

The workflow types live in `backend/src/workflow/workflow.types.ts`. `frontend/src/app/workflow/workflow.types.ts` is a copy; keep the two in sync until a shared package is worth it.

### Seed data is not a result

The seed workflow is `READY`, not `COMPLETE`. Test results are `NOT_RUN` and every plan step and verification check is `PENDING`. The dashboard never reports a passing test that did not actually run.

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

In scope for Phase 1: the scaffold above, seeded data, tests, lint, Docker and CI.

Not in scope: GitHub integration, Claude API or Claude Code execution, authentication, databases, queues, Kubernetes, subscriptions, multi-agent systems, or running arbitrary repositories.

## Phase 2 and beyond

- GitHub issue ingestion (replace the seed source).
- Bounded Claude Code execution against `demo-target`.
- Real test results and verification fed back into the dashboard.

See [docs/learning-map.md](docs/learning-map.md) for how Phase 1 maps to the workflow skills it demonstrates.
