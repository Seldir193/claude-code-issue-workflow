export type WorkflowStatus = 'READY' | 'IN_PROGRESS' | 'COMPLETE';
export type StepStatus = 'PENDING' | 'DONE';
export type FileChangeStatus = 'PLANNED' | 'CHANGED';
export type TestRunStatus = 'NOT_RUN' | 'PASSED' | 'FAILED';
export type CheckStatus = 'PENDING' | 'VERIFIED' | 'FAILED';
export type CancelExpectation = 'ALLOWED' | 'BLOCKED';

export interface RepositoryInfo {
  name: string;
  path: string;
  language: string;
  defaultBranch: string;
  description: string;
}

export interface IssueInfo {
  number: number;
  title: string;
  body: string;
  state: 'OPEN' | 'CLOSED';
  labels: string[];
}

export interface AnalysisFinding {
  file: string;
  symbol: string;
  note: string;
}

export interface AnalysisInfo {
  summary: string;
  findings: AnalysisFinding[];
}

export interface PlanStep {
  order: number;
  title: string;
  detail: string;
  status: StepStatus;
}

export interface FileChange {
  path: string;
  reason: string;
  status: FileChangeStatus;
}

export interface TestResults {
  status: TestRunStatus;
  command: string;
  note: string;
}

export interface VerificationCheck {
  orderStatus: string;
  expected: CancelExpectation;
  status: CheckStatus;
}

export interface VerificationReport {
  status: CheckStatus;
  summary: string;
  checks: VerificationCheck[];
}

export interface ImplementationReport {
  outcome: string;
  changedFileCount: number;
  passedTestCount: number;
  verifiedCheckCount: number;
  conclusion: string;
}

export interface WorkflowSummary {
  id: string;
  status: WorkflowStatus;
  // GITHUB: the issue block came from the GitHub API. SEED: it is the seeded fallback.
  source: 'SEED' | 'GITHUB';
  // Set only when ingestion failed and the seeded issue is being served instead.
  ingestionError?: string;
  repository: RepositoryInfo;
  issue: IssueInfo;
  analysis: AnalysisInfo;
  plan: PlanStep[];
  filesChanged: FileChange[];
  testResults: TestResults;
  verification: VerificationReport;
  implementationReport: ImplementationReport;
}
