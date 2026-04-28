'use client'

import { useState, ReactNode } from 'react'

export interface Column<T> {
    key: keyof T | string
    header: string
    sortable?: boolean
    render?: (row: T) => ReactNode
    width?: number | string
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    loading?: boolean
    emptyTitle?: string
    emptyDescription?: string
    emptyIcon?: ReactNode
    onRowClick?: (row: T) => void
    keyExtractor: (row: T) => string | number
}

type SortDir = 'asc' | 'desc'

export default function DataTable<T>({
    columns,
    data,
    loading = false,
    emptyTitle = 'No data',
    emptyDescription = 'Nothing to show here yet.',
    emptyIcon,
    onRowClick,
    keyExtractor,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<SortDir>('asc')

    function handleSort(key: string) {
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(key)
            setSortDir('asc')
        }
    }

    const sorted = [...data].sort((a, b) => {
        if (!sortKey) return 0
        const av = (a as Record<string, unknown>)[sortKey]
        const bv = (b as Record<string, unknown>)[sortKey]
        if (av == null) return 1
        if (bv == null) return -1
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
        return sortDir === 'asc' ? cmp : -cmp
    })

    const thBase: React.CSSProperties = {
        padding: '10px 14px',
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        color: 'var(--ink-25)',
        textAlign: 'left',
        borderBottom: '1px solid var(--line)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        background: 'var(--bg)',
    }

    return (
        <div style={{ border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', background: 'var(--bg-card)' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    style={{
                                        ...thBase,
                                        width: col.width,
                                        cursor: col.sortable ? 'pointer' : 'default',
                                    }}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                        {col.header}
                                        {col.sortable && (
                                            <SortIcon active={sortKey === String(col.key)} dir={sortDir} />
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((col) => (
                                        <td key={String(col.key)} style={{ padding: '14px 14px' }}>
                                            <div style={{ height: 14, borderRadius: 6, background: 'var(--line)', width: '60%', animation: 'pulse-skeleton 1.4s ease infinite' }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : sorted.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length}>
                                    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                        {emptyIcon && (
                                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-bg)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {emptyIcon}
                                            </div>
                                        )}
                                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{emptyTitle}</div>
                                        <div style={{ fontSize: 12.5, color: 'var(--ink-50)', lineHeight: 1.6 }}>{emptyDescription}</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            sorted.map((row) => (
                                <tr
                                    key={keyExtractor(row)}
                                    style={{ borderTop: '1px solid var(--line)', cursor: onRowClick ? 'pointer' : 'default', transition: 'background .15s' }}
                                    onClick={() => onRowClick?.(row)}
                                    onMouseEnter={(e) => { if (onRowClick) e.currentTarget.style.background = 'var(--bg-warm)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                                >
                                    {columns.map((col) => (
                                        <td key={String(col.key)} style={{ padding: '13px 14px', color: 'var(--ink)', verticalAlign: 'middle' }}>
                                            {col.render
                                                ? col.render(row)
                                                : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                @keyframes pulse-skeleton {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .4; }
                }
            `}</style>
        </div>
    )
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    return (
        <svg viewBox="0 0 10 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 9, height: 12, opacity: active ? 1 : 0.35, color: active ? 'var(--accent)' : 'currentColor' }}>
            <path d="M5 1v12M2 4l3-3 3 3" style={{ opacity: active && dir === 'asc' ? 1 : 0.5 }} />
            <path d="M2 10l3 3 3-3" style={{ opacity: active && dir === 'desc' ? 1 : 0.5 }} />
        </svg>
    )
}
