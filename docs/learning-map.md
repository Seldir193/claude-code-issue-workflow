# Learning map

How Phases 1-3 map to the maintenance practices this project demonstrates.

| Practice | Evidence in the project |
| --- | --- |
| Issue-driven development | GitHub Issue #3 is the single bounded task from context gathering through verification. |
| Context gathering | The backend reads the issue number, title, body, state and labels from the GitHub Issues API. |
| Codebase exploration | Analysis identifies `CANCELLABLE_STATUSES` and the missing SHIPPED coverage before editing. |
| Planning before implementation | The dashboard records three ordered steps: locate the rule, update the guard, add regression coverage. |
| Targeted editing | The functional fix is limited to `src/order-service.ts` and `tests/order-service.spec.ts`. |
| Regression testing | SHIPPED is now covered in both `canCancel` and `cancelOrder`; the suite passes 7/7 tests. |
| Type safety | `npm run typecheck` passes after the fix. |
| Verification | NEW and PROCESSING are verified allowed; SHIPPED and CANCELLED are verified blocked. |
| Git diff review | The phase is reviewed with `git diff` and `git diff --check` before one focused commit. |
| CI discipline | Backend, frontend and demo-target checks run in GitHub Actions after the change reaches `main`. |

## Phase progression

**Phase 1 — scaffold:** created the dashboard, typed workflow contract, demo target, Docker and CI without claiming unexecuted work.

**Phase 2 — GitHub ingestion:** replaced mock issue context with a bounded native-fetch integration for Issue #3, including validated payload mapping and an explicit fallback path.

**Phase 3 — implementation and verification:** confirmed the root cause, removed `SHIPPED` from the cancellable allow-list, added regression coverage, ran focused tests/typecheck and changed the workflow record from pending to complete.

## Final workflow state

- Workflow: `COMPLETE`
- Plan steps: `DONE`
- Changed files: `CHANGED`
- Tests: `PASSED`
- Verification checks: `VERIFIED`
- Demo-target tests: 7/7 passed
- TypeScript typecheck: passed
