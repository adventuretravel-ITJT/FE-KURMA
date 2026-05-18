import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md';
}

interface CardHeaderProps {
  title: string;
  action?: ReactNode;
}

export function Card({ children, className = '', padding = 'none' }: CardProps) {
  const p = padding === 'md' ? 'p-5' : padding === 'sm' ? 'p-4' : '';
  return (
    <div
      className={`bg-[var(--kg-paper)] rounded-[10px] overflow-hidden ${p} ${className}`}
      style={{ boxShadow: 'inset 0 0 0 1px #e1e3e5, 0 1px 3px rgba(0,0,0,.06)' }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--kg-hairline)]">
      <h3 className="text-sm font-semibold text-[var(--kg-ink)]">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}
