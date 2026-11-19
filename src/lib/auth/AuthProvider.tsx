import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isAuthConfigured, supabase } from '../supabase'
import { mapAuthError, parseRole, type AccountRole } from './helpers'

export interface AuthProfile {
  id: string
  role: AccountRole | null
  full_name: string | null
  company_name: string | null
  avatar_url: string | null
}
type AuthStatus = 'loading' | 'signedOut' | 'signedIn' | 'unconfigured' | 'profileError'
type AuthState = {
  session: Session | null; user: User | null; profile: AuthProfile | null; status: AuthStatus
  profileError: string | null; refreshProfile: () => Promise<void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: AccountRole, fullName: string, companyName?: string) => Promise<{ confirmationRequired: boolean }>
  signInWithGoogle: (role: AccountRole) => Promise<void>; signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>; updatePassword: (password: string) => Promise<void>
  chooseRole: (role: AccountRole) => Promise<void>
}

const Context = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [status, setStatus] = useState<AuthStatus>(isAuthConfigured ? 'loading' : 'unconfigured')
  const [profileError, setProfileError] = useState<string | null>(null)

  const refreshProfile = useCallback(async () => {
    if (!supabase || !session?.user) { setProfile(null); return }
    setStatus('loading')
    setProfileError(null)
    const { data, error } = await supabase.from('profiles').select('id,role,full_name,company_name,avatar_url').eq('id', session.user.id).maybeSingle()
    if (error) {
      setProfile(null)
      setProfileError(mapAuthError(error))
      setStatus('profileError')
      throw error
    }
    setProfile(data ? { ...data, role: parseRole(data.role) } : null)
    setStatus('signedIn')
  }, [session])

  useEffect(() => {
    if (!supabase) { setStatus('unconfigured'); return }
    let active = true
    const hydrate = async (next: Session | null) => {
      if (!active) return
      setSession(next)
      setProfile(null)
      setProfileError(null)
      if (!next) { setStatus('signedOut'); return }
      setStatus('loading')
      const { data, error } = await supabase!.from('profiles').select('id,role,full_name,company_name,avatar_url').eq('id', next.user.id).maybeSingle()
      if (!active) return
      if (error) { setProfileError(mapAuthError(error)); setStatus('profileError'); return }
      setProfile(data ? { ...data, role: parseRole(data.role) } : null)
      setStatus('signedIn')
    }
    void supabase!.auth.getSession().then(({ data }) => hydrate(data.session)).catch(() => { if (active) setStatus('signedOut') })
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, next) => { void hydrate(next) })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  const run = async (fn: () => Promise<{ error: Error | null }>, context?: 'signin') => {
    if (!supabase) throw new Error("Sign-in isn't configured.")
    const { error } = await fn()
    if (error) throw new Error(mapAuthError(error, context))
  }

  const value = useMemo<AuthState>(() => ({
    session, user: session?.user ?? null, profile, status, profileError, refreshProfile,
    signInWithPassword: (email, password) => run(() => supabase!.auth.signInWithPassword({ email, password }), 'signin'),
    signUp: async (email, password, role, fullName, companyName = '') => {
      if (!supabase) throw new Error("Sign-in isn't configured.")
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role, full_name: fullName, company_name: companyName } } })
      if (error) throw new Error(mapAuthError(error))
      return { confirmationRequired: !data.session }
    },
    signInWithGoogle: async (role) => {
      if (!supabase) throw new Error("Sign-in isn't configured.")
      sessionStorage.setItem('pc_intended_role', role)
      await run(() => supabase!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } }))
    },
    signOut: () => run(() => supabase!.auth.signOut()),
    resetPassword: (email) => run(() => supabase!.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/reset-password` })),
    updatePassword: (password) => run(() => supabase!.auth.updateUser({ password })),
    chooseRole: async (role) => {
      if (!supabase) throw new Error("Sign-in isn't configured.")
      const { error } = await supabase.rpc('choose_role', { new_role: role })
      if (error) throw new Error(mapAuthError(error))
      await refreshProfile()
    },
  }), [session, profile, status, profileError, refreshProfile])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useAuth() {
  const value = useContext(Context)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
