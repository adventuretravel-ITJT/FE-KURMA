interface BadgeProps {
  label?: string;
  color?: string;
  bg?: string;
  status?: string;
  config?: Record<string, { label: string; color: string; bg: string }>;
}

export function Badge({ label, color, bg, status, config }: BadgeProps) {
  
  const resolved = status && config ? config[status] : null;
  const _label = label ?? resolved?.label ?? status ?? '';
  const _color = color ?? resolved?.color ?? '#8A95A2';
  const _bg = bg ?? resolved?.bg ?? 'transparent';

  return (
    <span
      className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize leading-none"
      style={{ color: _color, background: _bg }}
    >
      {_label}
    </span>
  );
}