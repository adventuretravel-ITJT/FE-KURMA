import React from 'react'

export interface SelectOptionProps {
    selected: boolean
    onClick: () => void
    icon: React.ReactNode
    label: string
    description?: string
    style?: React.CSSProperties
}

/* ── Shared wrapper styles ── */
function baseStyle(selected: boolean): React.CSSProperties {
    return {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 12,
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'all .18s',
        border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--line-strong)'}`,
        background: selected ? 'var(--accent-bg)' : 'var(--bg)',
        textAlign: 'left',
        width: '100%',
    }
}

function iconWrapStyle(selected: boolean): React.CSSProperties {
    return {
        width: 34,
        height: 34,
        borderRadius: 9,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: selected ? 'rgba(44,95,78,.12)' : 'var(--ink-05)',
        color: selected ? 'var(--accent)' : 'var(--ink-50)',
        transition: 'all .18s',
    }
}

/* ══════════════════════════════════════════════
   RadioOption — single select (circular indicator)
══════════════════════════════════════════════ */
export function RadioOption({ selected, onClick, icon, label, description, style }: SelectOptionProps) {
    return (
        <button type="button" onClick={onClick} style={{ ...baseStyle(selected), ...style }}>
            <span style={iconWrapStyle(selected)}>{icon}</span>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: selected ? 'var(--accent)' : 'var(--ink)',
                    lineHeight: 1.3,
                }}>
                    {label}
                </div>
                {description && (
                    <div style={{
                        fontSize: 11.5,
                        color: selected ? 'var(--accent-light)' : 'var(--ink-25)',
                        marginTop: 2,
                        lineHeight: 1.4,
                    }}>
                        {description}
                    </div>
                )}
            </div>

            {/* Radio circle */}
            <div style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: `2px solid ${selected ? 'var(--accent)' : 'var(--line-strong)'}`,
                background: selected ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all .18s',
            }}>
                {selected && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                )}
            </div>
        </button>
    )
}

/* ══════════════════════════════════════════════
   CheckboxOption — multi-select (square indicator)
══════════════════════════════════════════════ */
export function CheckboxOption({ selected, onClick, icon, label, description, style }: SelectOptionProps) {
    return (
        <button type="button" onClick={onClick} style={{ ...baseStyle(selected), ...style }}>
            <span style={iconWrapStyle(selected)}>{icon}</span>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: 13,
                    fontWeight: selected ? 600 : 500,
                    color: selected ? 'var(--accent)' : 'var(--ink)',
                    lineHeight: 1.3,
                }}>
                    {label}
                </div>
                {description && (
                    <div style={{
                        fontSize: 11.5,
                        color: selected ? 'var(--accent-light)' : 'var(--ink-25)',
                        marginTop: 2,
                        lineHeight: 1.4,
                    }}>
                        {description}
                    </div>
                )}
            </div>

            {/* Checkbox square */}
            <div style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: `2px solid ${selected ? 'var(--accent)' : 'var(--line-strong)'}`,
                background: selected ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all .18s',
            }}>
                {selected && (
                    <svg viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                        <path d="M2 5.5l2 2 4-4" />
                    </svg>
                )}
            </div>
        </button>
    )
}
