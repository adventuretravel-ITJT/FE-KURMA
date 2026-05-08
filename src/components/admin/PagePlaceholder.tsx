import { LucideIcon } from 'lucide-react';

interface PagePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  module: string;
}

export default function PagePlaceholder({ icon: Icon, title, description, module }: PagePlaceholderProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--kg-ink)]">{title}</h1>
        <p className="text-sm text-[var(--kg-ink-56)] mt-1">{description}</p>
      </div>

      <div className="border border-dashed border-[var(--kg-hairline)] rounded-xl p-16 flex flex-col items-center justify-center gap-4 text-center bg-[var(--kg-paper)]">
        <div className="w-14 h-14 rounded-2xl bg-[var(--kg-surface-mist)] flex items-center justify-center">
          <Icon className="w-7 h-7 text-[var(--kg-primary)]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--kg-ink)]">Modul {module}</p>
          <p className="text-sm text-[var(--kg-ink-40)] mt-1">
            Halaman ini sedang dalam pengembangan
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--kg-surface-mist)] text-xs font-medium text-[var(--kg-primary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--kg-primary)] animate-pulse" />
          Coming Soon
        </span>
      </div>
    </div>
  );
}
