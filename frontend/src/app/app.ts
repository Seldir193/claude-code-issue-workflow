import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { WorkflowService } from './workflow/workflow.service';
import type { WorkflowSummary } from './workflow/workflow.types';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'ready'; summary: WorkflowSummary };

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly workflow = inject(WorkflowService);

  protected readonly state = toSignal(
    this.workflow.getSummary().pipe(
      map((summary): ViewState => ({ kind: 'ready', summary })),
      catchError(() => of<ViewState>({ kind: 'error' })),
      startWith<ViewState>({ kind: 'loading' }),
    ),
    { requireSync: true },
  );

  protected chipClass(status: string): string {
    return `chip chip--${status.toLowerCase().replaceAll('_', '-')}`;
  }

  protected label(status: string): string {
    return status.replaceAll('_', ' ');
  }
}
