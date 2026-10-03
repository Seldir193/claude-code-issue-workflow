# Learning map

How Phase 1 maps to the practices this project is meant to demonstrate.

| Practice | Where it shows up in Phase 1 |
| -------- | ---------------------------- |
| Codebase exploration | The **Analysis** section lists findings by file and symbol (`CANCELLABLE_STATUSES`, `canCancel`) in `demo-target`. |
| Context gathering | The **Repository** and **Issue** sections capture what the workflow knows before it plans: the repo layout and the issue text. |
| Planning before implementation | The **Implementation Plan** section has three ordered steps (locate the rule, update the guard, add a regression test), all `PENDING`. Nothing is edited until a plan exists. |
| Targeted editing | **Files Changed** names only `src/order-service.ts` and `tests/order-service.spec.ts`, both `PLANNED`. The fix is one allow-list entry plus one test. |
| Testing | `demo-target` has a passing baseline suite. The SHIPPED case is an `it.todo`, so the regression test is part of the future fix. |
| Verification | The **Verification Report** lists the four expected outcomes: NEW allowed, PROCESSING allowed, SHIPPED blocked, CANCELLED blocked. All are `PENDING` until a run confirms them. |
| Git diff review | Phase 1 is committed as a single scaffold commit after reviewing the diff. Later phases will report the diff of each targeted change. |
| Issue-driven development | Everything is organised around Issue #3, "Order cancellation remains enabled after shipment", from analysis through the final report. |

## What is real and what is seeded

- Real: the backend API, the dashboard, the demo codebase and its tests, Docker and CI.
- Seeded: the workflow data (issue, analysis, plan, files, verification). Phase 2 replaces this with GitHub issue ingestion and bounded Claude Code execution.
