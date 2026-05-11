import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string; // ← tambah alias, atau ganti subtitle → description
  action?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, subtitle, description, action, icon }: PageHeaderProps) {
  const subtext = subtitle ?? description; // support kedua nama prop

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[var(--kg-ink-56)]">{icon}</span>}
        <div>
          <h1 className="text-[20px] font-bold text-[var(--kg-ink)] leading-tight">{title}</h1>
          {subtext && (
            <p className="text-sm text-[var(--kg-ink-56)] mt-0.5">{subtext}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}