import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: number | string;
  sub: string;
  color?: string;
  trend?: { value: number; positive: boolean };
}

export function StatCard({ label, value, sub, trend }: StatCardProps) {
  return (
    <div
      className="bg-[var(--kg-paper)] rounded-[10px] p-5"
      style={{ boxShadow: 'inset 0 0 0 1px #e1e3e5, 0 1px 3px rgba(0,0,0,.06)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium leading-none uppercase tracking-wider" style={{ color: '#8a8a8a' }}>
          {label}
        </p>
        {trend && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
            style={{
              color: trend.positive ? '#008060' : '#d72c0d',
              background: trend.positive ? '#e3f1df' : '#fef2ee',
            }}
          >
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mt-2 leading-none tabular-nums" style={{ color: '#1a1a1a' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-xs mt-1.5" style={{ color: '#616161' }}>{sub}</p>
    </div>
  );
}
