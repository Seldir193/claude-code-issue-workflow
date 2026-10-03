import { createApp } from './app';

const port = Number(process.env.PORT ?? 3000);

createApp().listen(port, () => {
  process.stdout.write(`issue-workflow-backend listening on port ${port}\n`);
});
