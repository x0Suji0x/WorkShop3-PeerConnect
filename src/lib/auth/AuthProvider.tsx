import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
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

export type AuthStatus =
  | 'loading'
  | 'signedOut'
  | 'signedIn'
  | 'unconfigured'
  | 'profileError'

type AuthState = {
  session: Session | null
  user: User | null
  profile: AuthProfile | null
  status: AuthStatus
  profileError: string | null
  refreshProfile: () => Promise<void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    role: AccountRole,
    fullName: string,
    companyName?: string,
  ) => Promise<{ confirmationRequired: boolean }>
  signInWithGoogle: (role: AccountRole) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  chooseRole: (role: AccountRole) => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

function requireSupabase() {
  if (!supabase) throw new Error("Sign-in isn't configured.")
  return supabase
}

function toAuthProfile(
  userId: string,
  data: {
    id: string
    role: unknown
    full_name: string | null
    company_name: string | null
    avatar_url: string | null
  } | null,
): AuthProfile {
  return {
    id: userId,
    role: parseRole(data?.role),
    full_name: data?.full_name ?? null,
    company_name: data?.company_name ?? null,
    avatar_url: data?.avatar_url ?? null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [status, setStatus] = useState<AuthStatus>(
    isAuthConfigured ? 'loading' : 'unconfigured',
  )
  const [profileError, setProfileError] = useState<string | null>(null)
  const profileRequestId = useRef(0)
  const mounted = useRef(false)

  const loadProfile = useCallback(async (nextSession: Session) => {
    const requestId = ++profileRequestId.current
    setStatus('loading')
    setProfileError(null)

    try {
      const { data, error } = await requireSupabase()
        .from('profiles')
        .select('id,role,full_name,company_name,avatar_url')
        .eq('id', nextSession.user.id)
        .maybeSingle()

      if (!mounted.current || requestId !== profileRequestId.current) return

      if (error) throw error

      // A missing row behaves like a profile with no role, so the user can finish setup.
      setProfile(toAuthProfile(nextSession.user.id, data))
      setStatus('signedIn')
    } catch (error) {
      if (!mounted.current || requestId !== profileRequestId.current) return
      setProfile(null)
      setProfileError(mapAuthError(error))
      setStatus('profileError')
      throw error
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      setProfile(null)
      setProfileError(null)
      setStatus('unconfigured')
      return
    }
    if (!session) {
      setProfile(null)
      setProfileError(null)
      setStatus('signedOut')
      return
    }

    await loadProfile(session)
  }, [loadProfile, session])

  useEffect(() => {
    mounted.current = true

    if (!supabase) {
      setStatus('unconfigured')
      return () => {
        mounted.current = false
      }
    }

    let receivedAuthEvent = false
    const hydrate = (nextSession: Session | null) => {
      receivedAuthEvent = true
      setSession(nextSession)
      setProfile(null)
      setProfileError(null)

      if (!nextSession) {
        profileRequestId.current += 1
        setStatus('signedOut')
        return
      }

      void loadProfile(nextSession).catch(() => {
        // loadProfile publishes its own profileError state for the UI to retry.
      })
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      receivedAuthEvent = true
      queueMicrotask(() => {
        if (mounted.current) hydrate(nextSession)
      })
    })

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted.current || receivedAuthEvent) return
      if (error) {
        setSession(null)
        setProfile(null)
        setStatus('signedOut')
        return
      }
      hydrate(data.session)
    }).catch(() => {
      if (!mounted.current || receivedAuthEvent) return
      setSession(null)
      setProfile(null)
      setStatus('signedOut')
    })

    return () => {
      mounted.current = false
      profileRequestId.current += 1
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const client = requireSupabase()
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw new Error(mapAuthError(error, 'signin'))
  }, [])

  const signUp = useCallback(async (
    email: string,
    password: string,
    role: AccountRole,
    fullName: string,
    companyName = '',
  ) => {
    const client = requireSupabase()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          company_name: companyName,
        },
      },
    })

    if (error) throw new Error(mapAuthError(error))
    return { confirmationRequired: !data.session }
  }, [])

  const signInWithGoogle = useCallback(async (role: AccountRole) => {
    const client = requireSupabase()
    sessionStorage.setItem('pc_intended_role', role)
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw new Error(mapAuthError(error, 'signin'))
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await requireSupabase().auth.signOut()
    if (error) throw new Error(mapAuthError(error))
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await requireSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw new Error(mapAuthError(error))
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await requireSupabase().auth.updateUser({ password })
    if (error) throw new Error(mapAuthError(error))
  }, [])

  const chooseRole = useCallback(async (role: AccountRole) => {
    const { error } = await requireSupabase().rpc('choose_role', { new_role: role })
    if (error) throw new Error(mapAuthError(error))
    await refreshProfile()
  }, [refreshProfile])

  const value = useMemo<AuthState>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    status,
    profileError,
    refreshProfile,
    signInWithPassword,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    chooseRole,
  }), [
    session,
    profile,
    status,
    profileError,
    refreshProfile,
    signInWithPassword,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    chooseRole,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
