import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, reason?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const USERS_KEY = 'wellmind_users'
const SESSION_KEY = 'wellmind_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* noop */ }
    }
    setLoading(false)
  }, [])

  const getUsers = (): Record<string, { name: string; email: string; password: string; id: string; reason?: string }> => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers()
    const match = Object.values(users).find(u => u.email === email && u.password === password)
    if (!match) return false
    const authUser: AuthUser = { id: match.id, name: match.name, email: match.email }
    setUser(authUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser))
    return true
  }

  const register = async (name: string, email: string, password: string, reason?: string): Promise<boolean> => {
    const users = getUsers()
    const exists = Object.values(users).find(u => u.email === email)
    if (exists) return false
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
    users[id] = { id, name, email, password, reason }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const authUser: AuthUser = { id, name, email }
    setUser(authUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
