import express, { type Express, type Request, type Response } from 'express';
import { getWorkflowSummary, type IssueLoader } from './workflow/workflow.service';
import type { WorkflowSummary } from './workflow/workflow.types';

export interface HealthResponse {
  status: 'ok';
  service: string;
}

export interface AppDependencies {
  loadIssue: IssueLoader;
}

export function createApp({ loadIssue }: AppDependencies): Express {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/health', (_req: Request, res: Response<HealthResponse>) => {
    res.json({ status: 'ok', service: 'issue-workflow-backend' });
  });

  app.get('/api/workflow-summary', async (_req: Request, res: Response<WorkflowSummary>) => {
    res.json(await getWorkflowSummary(loadIssue));
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
