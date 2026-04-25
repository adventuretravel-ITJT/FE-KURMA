'use client'

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import PasswordStrength from '@/components/ui/PasswordStrength'

interface RegisterFormProps {
    onSwitchToLogin: () => void
    onSuccess: () => void
}

export default function RegisterForm({ onSwitchToLogin, onSuccess }: RegisterFormProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [terms, setTerms] = useState(false)
    const [errors, setErrors] = useState<{
        name?: string
        email?: string
        password?: string
        terms?: string
    }>({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const newErrors: typeof errors = {}
        if (!name.trim()) newErrors.name = 'Full name is required.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email.'
        if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.'
        if (!terms) newErrors.terms = 'You must accept the Terms to continue.'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.errors?.email) {
                    setErrors({ email: data.errors.email[0] })
                } else {
                    setErrors({ email: data.message || 'Registration failed.' })
                }
                return
            }

            localStorage.setItem('token', data.token)
            onSuccess()

        } catch {
            setErrors({ email: 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                }}
                error={errors.name}
                autoComplete="name"
            />

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

            <div className="flex flex-col gap-1">
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
                    autoComplete="new-password"
                />
                <PasswordStrength password={password} />
            </div>

            <Checkbox
                id="terms"
                checked={terms}
                onChange={(checked) => {
                    setTerms(checked)
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }))
                }}
                error={errors.terms}
                label={
                    <>
                        I agree to the{' '}
                        <a href="/terms" className="underline" style={{ color: '#2C5F4E' }}>Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="underline" style={{ color: '#2C5F4E' }}>Privacy Policy</a>
                    </>
                }
            />

            <Button
                type="submit"
                loading={loading}
                className="w-full h-12 mt-1"
            >
                Create account
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" />
                </svg>
            </Button>

            <p className="text-center text-sm mt-2" style={{ color: 'var(--ink-25)' }}>
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-medium transition-colors"
                    style={{ color: '#2C5F4E' }}
                >
                    Sign in
                </button>
            </p>

        </form>
    )
}