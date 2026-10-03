import { createApp } from './app';
import { loadIssueFromGitHub } from './workflow/workflow.service';

const port = Number(process.env.PORT ?? 3000);

createApp({ loadIssue: loadIssueFromGitHub }).listen(port, () => {
  process.stdout.write(`issue-workflow-backend listening on port ${port}\n`);
});
