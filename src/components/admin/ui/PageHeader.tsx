import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, subtitle, description, action, icon }: PageHeaderProps) {
  const subtext = subtitle ?? description;
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        {icon && <span style={{ color: '#8a8a8a' }}>{icon}</span>}
        <div>
          <h1 className="text-[20px] font-bold leading-tight" style={{ color: '#1a1a1a' }}>{title}</h1>
          {subtext && <p className="text-sm mt-0.5" style={{ color: '#8a8a8a' }}>{subtext}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}