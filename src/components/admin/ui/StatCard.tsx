import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sub: string;
  color: string;
  trend?: { value: number; positive: boolean };
}

export function StatCard({ icon: Icon, label, value, sub, color, trend }: StatCardProps) {
  return (
    <div
      className="bg-[var(--kg-paper)] border border-[var(--kg-hairline)] rounded-xl p-5"
      style={{ boxShadow: 'var(--kg-shadow-soft-1)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {trend && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
            style={{
              color: trend.positive ? '#2E8B57' : 'var(--kg-coral)',
              background: trend.positive ? 'rgba(46,139,87,.10)' : 'rgba(255,107,107,.10)',
            }}
          >
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-medium text-[var(--kg-ink-40)] uppercase tracking-wider leading-none">
          {label}
        </p>
        <p className="text-2xl font-bold text-[var(--kg-ink)] mt-1.5 leading-none tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-xs text-[var(--kg-ink-56)] mt-1.5">{sub}</p>
      </div>
    </div>
  );
}
