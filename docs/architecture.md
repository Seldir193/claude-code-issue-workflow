# Architecture

The project is intentionally small. It demonstrates one bounded issue moving from external context to a verified code change without turning into a general-purpose code execution platform.

```mermaid
flowchart LR
  GH[GitHub Issue #3] --> API[Node.js / Express backend]
  API --> WF[Typed WorkflowSummary]
  WF --> UI[Angular dashboard]
  WF --> REPORT[Implementation Report]
  CODE[demo-target TypeScript] --> TEST[Vitest + TypeScript]
  TEST --> WF
  CI[GitHub Actions] --> CODE
  CI --> API
  CI --> UI
```

## Issue-to-implementation flow

```mermaid
flowchart TD
  A[Read GitHub issue] --> B[Explore bounded demo-target]
  B --> C[Identify root cause]
  C --> D[Write implementation plan]
  D --> E[Targeted two-file change]
  E --> F[Focused regression tests]
  F --> G[Typecheck and full regression]
  G --> H[Git diff review]
  H --> I[Verification report]
  I --> J[Implementation report]
```

## Boundaries

- The GitHub integration reads one configured issue.
- The demo target is a local, controlled TypeScript codebase.
- Tests do not call the live GitHub API.
- There is no arbitrary repository execution, authentication, database, queue, multi-agent orchestration or production deployment layer.
