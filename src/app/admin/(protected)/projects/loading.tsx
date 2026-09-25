export default function AdminProjectsLoading() {
  return (
    <div className="space-y-6" role="status">
      <span className="sr-only">Loading projects</span>
      <div className="h-10 w-56 animate-pulse rounded-control bg-surface-secondary" />
      <div className="h-64 animate-pulse rounded-card border border-border bg-surface-primary" />
    </div>
  );
}
