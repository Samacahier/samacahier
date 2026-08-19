import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: string;
  Icone: LucideIcon;
  fondIcone: string;
  couleurIcone: string;
};

export default function KpiCard({ label, value, Icone, fondIcone, couleurIcone }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <span className="text-[10.5px] font-bold tracking-wide text-ink-muted uppercase">
          {label}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] ${fondIcone}`}
        >
          <Icone className={`h-4 w-4 ${couleurIcone}`} />
        </span>
      </div>
      <span className="font-mono text-2xl font-bold text-ink">{value}</span>
    </div>
  );
}
