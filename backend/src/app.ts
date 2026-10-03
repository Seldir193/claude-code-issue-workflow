import express, { type Express, type Request, type Response } from 'express';
import { workflowSeed } from './workflow/workflow.seed';
import type { WorkflowSummary } from './workflow/workflow.types';

export interface HealthResponse {
  status: 'ok';
  service: string;
}

export function createApp(): Express {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/health', (_req: Request, res: Response<HealthResponse>) => {
    res.json({ status: 'ok', service: 'issue-workflow-backend' });
  });

  app.get('/api/workflow-summary', (_req: Request, res: Response<WorkflowSummary>) => {
    res.json(workflowSeed);
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
