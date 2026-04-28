'use client'

import { createContext, useContext } from 'react'

export interface User {
    id: number
    name: string
    email: string
    role?: { name: string; slug: string }
}

interface UserContextType {
    user: User
    onLogout: () => void
    sidebarOpen: boolean
    onToggleSidebar: () => void
    onCloseSidebar: () => void
}

export const UserContext = createContext<UserContextType | null>(null)

export function useUser(): UserContextType {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser must be used inside DashboardLayout')
    return ctx
}
