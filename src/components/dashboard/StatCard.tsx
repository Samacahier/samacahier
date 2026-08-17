type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-card p-4">
      <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
        {label}
      </span>
      <span className="text-2xl font-semibold text-ink">{value}</span>
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
    </div>
  );
}
