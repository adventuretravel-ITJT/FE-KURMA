'use client'

import React, { useState } from 'react'
import AuthLeft from '@/components/auth/AuthLeft'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import SuccessState from '@/components/auth/SuccessState'

type Panel = 'login' | 'register'

export default function AuthPage() {
    const [panel, setPanel] = useState<Panel>('login')
    const [success, setSuccess] = useState(false)

    return (
        <div className="grid lg:grid-cols-2 min-h-screen">

            {/* Left Panel */}
            <AuthLeft />

            {/* Right Panel */}
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
                <div className="max-w-sm w-full mx-auto">

                    {success ? (
                        <SuccessState />
                    ) : (
                        <>
                            {/* Heading */}
                            <div className="mb-8">
                                <h1
                                    className="font-serif font-medium text-3xl tracking-tight mb-1"
                                    style={{ color: 'var(--ink)', letterSpacing: '-.03em' }}
                                >
                                    {panel === 'login' ? 'Welcome back.' : 'Join Kurma.'}
                                </h1>
                                <p className="text-sm" style={{ color: 'var(--ink-25)' }}>
                                    {panel === 'login'
                                        ? 'Sign in to continue planning.'
                                        : 'Create your free account today.'}
                                </p>
                            </div>

                            {/* Tabs */}
                            <div
                                className="flex p-1 rounded-xl mb-7"
                                style={{ background: 'var(--ink-05)', border: '1px solid var(--line)' }}
                            >
                                {(['login', 'register'] as Panel[]).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setPanel(tab)}
                                        className="flex-1 h-8 rounded-lg text-sm font-medium transition-all duration-200"
                                        style={{
                                            background: panel === tab ? '#fff' : 'transparent',
                                            color: panel === tab ? 'var(--ink)' : 'var(--ink-25)',
                                            boxShadow: panel === tab ? '0 1px 4px rgba(17,17,16,.08)' : 'none',
                                        }}
                                    >
                                        {tab === 'login' ? 'Sign in' : 'Create account'}
                                    </button>
                                ))}
                            </div>

                            {/* Forms */}
                            {panel === 'login' ? (
                                <LoginForm onSwitchToRegister={() => setPanel('register')} />
                            ) : (
                                <RegisterForm
                                    onSwitchToLogin={() => setPanel('login')}
                                    onSuccess={() => setSuccess(true)}
                                />
                            )}
                        </>
                    )}

                </div>
            </div>

        </div>
    )
}