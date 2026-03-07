// Real API hooks (kebab-case = canonical)
export * from './use-clients';
export * from './use-policies';
export * from './use-claims';
export * from './use-leads';
export * from './use-carriers';
export * from './use-reports';
export * from './use-finance';
export * from './use-users';
export * from './use-calendar';
export * from './use-renewals';
export * from './use-notifications';
export * from './use-settings';
export * from './use-complaints';
export * from './use-documents';
export * from './use-tasks';
export * from './use-approvals';
export * from './use-chat';

// TEMPORARY: Stub re-exports for pages not yet migrated to real hooks.
// Each page migration in Phase 4 should remove its stub dependency.
// Once all pages are migrated, delete this line AND stubs.ts.
export * from './stubs';
