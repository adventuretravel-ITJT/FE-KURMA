interface BadgeProps {
  label: string;
  color: string;
  bg: string;
}

export function Badge({ label, color, bg }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize leading-none"
      style={{ color, background: bg }}
    >
      {label}
    </span>
  );
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Draft',     color: '#8A95A2', bg: 'rgba(138,149,162,.12)' },
  active:    { label: 'Active',    color: '#1E6091', bg: 'rgba(30,96,145,.10)'   },
  completed: { label: 'Completed', color: '#2E8B57', bg: 'rgba(46,139,87,.10)'   },
};
