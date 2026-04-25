import react from 'react'

interface CheckboxProps {
    id?: string
    label?: React.ReactNode
    checked?: boolean
    onChange?: (checked: boolean) => void
    error?: string
}

export default function Checkbox({ id, label, checked, onChange, error }: CheckboxProps) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2.5">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange?.(e.target.checked)}
                    className="
                mt-0.5 w-4 h-4 shrink-0 rounded
                border border-[var(--line-strong)]
                accent-[#2c54f4e]
                cursor-pointer
                "
                />
                <label
                    htmlFor={id}
                    className="text-sm text-[var(--ink-50)] cursor-pointer leading-snug"
                >
                    {label}
                </label>
            </div>
            {error && (
                <p className="text-xs text-[var(--error)] ml-6">{error}</p>
            )}
        </div>
    )
}