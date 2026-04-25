'use client'

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface LoginFormProps {
    onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const newErrors: typeof errors = {}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.'
        }
        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setErrors({ email: data.message || 'Invalid credentials.' })
                return
            }

            // Simpan token
            localStorage.setItem('token', data.token)

            // Redirect ke dashboard
            window.location.href = '/dashboard'

        } catch {
            setErrors({ email: 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                error={errors.email}
                autoComplete="email"
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                error={errors.password}
                autoComplete="current-password"
            />

            <div className="flex justify-end -mt-1">
                <Link
                    href="/forgot-password"
                    className="text-xs font-medium transition-colors"
                    style={{ color: 'var(--ink-25)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2C5F4E')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-25)')}
                >
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                loading={loading}
                className="w-full h-12 mt-1"
            >
                Sign in
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
                </svg>
            </Button>

            <p className="text-center text-sm mt-2" style={{ color: 'var(--ink-25)' }}>
                Don&apos;t have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="font-medium transition-colors"
                    style={{ color: '#2C5F4E' }}
                >
                    Create one
                </button>
            </p>

        </form>
    )
}