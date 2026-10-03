# Learning map

This project was built in four deliberately small phases so the workflow is understandable instead of hidden behind a large application.

## Phase 1 — Scaffold and baseline

**What changed**
- Angular dashboard
- Node.js / Express backend
- Typed workflow contract
- Tiny TypeScript demo target
- Docker and GitHub Actions

**Why**
A maintenance workflow needs a trustworthy baseline before it can claim that a later change improved anything.

**Claude Code / engineering concept**
Codebase exploration, baseline verification, bounded scope and honest status reporting.

## Phase 2 — Real GitHub issue ingestion

**What changed**
- Issue #3 is read from the GitHub Issues API
- Payloads are validated and mapped into the workflow contract
- Tests inject fake network dependencies
- GitHub failure is represented explicitly with a seed fallback

**Why**
Implementation should start from real task context, but automated tests should not depend on live network behavior.

**Claude Code / engineering concept**
Context gathering, dependency injection, boundary validation and issue-driven development.

## Phase 3 — Targeted implementation and verification

**What changed**
- Root cause located in `CANCELLABLE_STATUSES`
- `SHIPPED` removed from the allow-list
- SHIPPED regression coverage added
- Focused tests and typecheck executed
- Workflow moved from pending to complete

**Why**
A good maintenance change is as small as possible while still proving the defect cannot regress.

**Claude Code / engineering concept**
Planning before implementation, targeted editing, regression testing, git diff review and verification.

## Phase 4 — Implementation report and portfolio evidence

**What changed**
- A typed `implementationReport` was added to the workflow contract
- The dashboard shows the final outcome and engineering evidence
- Architecture diagrams were added
- A real dashboard screenshot was captured for the README

**Why**
Engineering work is easier to review when the result is summarized from structured evidence instead of explained only in prose.

**Claude Code / engineering concept**
Implementation reporting, evidence packaging and recruiter-readable documentation.

## Final evidence

| Evidence | Result |
| --- | --- |
| Functional files changed | 2 |
| Demo-target tests | 7/7 passed |
| Cancellation outcomes verified | 4/4 |
| Demo-target typecheck | passed |
| Backend suite | passed |
| Frontend suite | passed |
| GitHub Actions | passed |

The project intentionally stops here. Authentication, databases, queues, multi-agent systems and arbitrary repository execution would make the example larger without improving the specific learning goal.
