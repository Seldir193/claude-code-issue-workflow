import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import type { WorkflowSummary } from './workflow/workflow.types';

const summary: WorkflowSummary = {
  id: 'wf-test',
  status: 'COMPLETE',
  source: 'SEED',
  repository: {
    name: 'demo-target',
    path: 'demo-target',
    language: 'TypeScript',
    defaultBranch: 'main',
    description: 'Test repository.',
  },
  issue: {
    number: 3,
    title: 'Order cancellation remains enabled after shipment',
    body: 'Body.',
    state: 'OPEN',
    labels: ['bug'],
  },
  analysis: { summary: 'Analysis summary.', findings: [{ file: 'a.ts', symbol: 's', note: 'n' }] },
  plan: [{ order: 1, title: 'Locate cancellation rule', detail: 'd', status: 'DONE' }],
  filesChanged: [{ path: 'src/order-service.ts', reason: 'r', status: 'CHANGED' }],
  testResults: { status: 'PASSED', command: 'npm test', note: '7 tests passed.' },
  verification: {
    status: 'VERIFIED',
    summary: 'Verified checks.',
    checks: [{ orderStatus: 'SHIPPED', expected: 'BLOCKED', status: 'VERIFIED' }],
  },
};

describe('App', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('shows a loading state before the backend responds', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Loading');
    http.expectOne('/api/workflow-summary');
  });

  it('renders every dashboard section from the backend summary', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    http.expectOne('/api/workflow-summary').flush(summary);
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const headings = Array.from(root.querySelectorAll('h2')).map((h) => h.textContent);
    expect(headings).toEqual([
      'Repository',
      'Issue',
      'Analysis',
      'Implementation Plan',
      'Files Changed',
      'Test Results',
      'Verification Report',
    ]);
    expect(root.textContent).toContain('Order cancellation remains enabled after shipment');
    expect(root.querySelector('[data-testid="workflow-status"]')?.textContent).toContain('COMPLETE');
  });

  it('says the issue came from GitHub when the backend ingested it', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    http.expectOne('/api/workflow-summary').flush({ ...summary, source: 'GITHUB' });
    await fixture.whenStable();

    const banner = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="source-banner"]',
    );
    expect(banner?.textContent).toContain('Issue loaded from GitHub');
    expect(banner?.textContent).toContain('completed Phase 3');
  });

  it('explains the seed fallback when GitHub ingestion failed', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    http
      .expectOne('/api/workflow-summary')
      .flush({ ...summary, ingestionError: 'GitHub responded with status 403' });
    await fixture.whenStable();

    const banner = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="source-banner"]',
    );
    expect(banner?.textContent).toContain('showing fallback issue data');
    expect(banner?.textContent).toContain('GitHub responded with status 403');
  });

  it('shows an error when the backend is unreachable', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    http.expectOne('/api/workflow-summary').error(new ProgressEvent('error'));
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')).not.toBeNull();
  });
});
