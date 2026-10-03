import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { WorkflowSummary } from './workflow.types';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<WorkflowSummary> {
    return this.http.get<WorkflowSummary>('/api/workflow-summary');
  }
}
