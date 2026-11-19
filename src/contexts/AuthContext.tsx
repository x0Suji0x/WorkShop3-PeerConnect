import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AuthContext } from './authContextDef'
import type {
  AuthUser,
  StudentSignupPayload,
  ClientSignupPayload,
  SocialAuthPayload,
  AuthResponse,
} from '../types/auth'

const TOKEN_KEY = 'peerconnect_token'
const ROLE_KEY = 'peerconnect_active_role'
const USER_KEY = 'peerconnect_user'
const CLIENT_AUTH_KEY = 'peerconnect_client_auth'

function syncClientAuth(user: AuthUser) {
  try {
    if (user.role === 'client') {
      const clientAuthData = {
        name: user.contactName || user.fullName,
        company: user.companyName || 'Apex Studio & Labs',
        email: user.email,
        role: 'client',
        isVerifiedEmployer: Boolean(user.isVerified),
      }
      localStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(clientAuthData))
    }
  } catch {
    // ignore localStorage errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      return saved ? (JSON.parse(saved) as AuthUser) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(TOKEN_KEY))
    } catch {
      return false
    }
  })

  const role = useMemo<'student' | 'client' | null>(() => {
    if (user?.role) return user.role
    try {
      const savedRole = localStorage.getItem(ROLE_KEY)
      if (savedRole === 'student' || savedRole === 'client') return savedRole
    } catch {
      // ignore
    }
    return null
  }, [user])

  const isAuthenticated = Boolean(user && token)

  // Asynchronous token verification on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    if (!savedToken) return

    let isMounted = true

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then(async (res) => {
        if (!isMounted) return
        if (res.ok) {
          const data = (await res.json()) as { user: AuthUser }
          setUser(data.user)
          try {
            localStorage.setItem(USER_KEY, JSON.stringify(data.user))
            localStorage.setItem(ROLE_KEY, data.user.role)
            syncClientAuth(data.user)
          } catch {
            // ignore
          }
        } else {
          setUser(null)
          setToken(null)
          try {
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => {
        console.warn('[Auth] Could not reach backend to refresh user session:', err)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Refresh user manually if needed
  const refreshUser = useCallback(async () => {
    const currentToken = token || localStorage.getItem(TOKEN_KEY)
    if (!currentToken) return

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })

      if (response.ok) {
        const data = (await response.json()) as { user: AuthUser }
        setUser(data.user)
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          localStorage.setItem(ROLE_KEY, data.user.role)
          syncClientAuth(data.user)
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.warn('[Auth] Refresh user error:', err)
    }
  }, [token])

  // Login action
  const login = useCallback(
    async ({
      email,
      password,
      role: requestedRole,
    }: {
      email: string
      password: string
      role?: 'student' | 'client'
    }): Promise<AuthResponse> => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: requestedRole }),
        })

        const data = (await response.json()) as {
          message?: string
          error?: string
          token?: string
          user?: AuthUser
        }

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Failed to sign in. Please verify your credentials.',
          }
        }

        if (data.token && data.user) {
          setToken(data.token)
          setUser(data.user)

          try {
            localStorage.setItem(TOKEN_KEY, data.token)
            localStorage.setItem(ROLE_KEY, data.user.role)
            localStorage.setItem(USER_KEY, JSON.stringify(data.user))
            syncClientAuth(data.user)
          } catch {
            // ignore
          }

          return { success: true, user: data.user, token: data.token }
        }

        return { success: false, error: 'Unexpected response from server.' }
      } catch (err) {
        console.error('[Auth Login Error]:', err)
        return {
          success: false,
          error: 'Cannot connect to authentication server. Please check your connection.',
        }
      }
    },
    []
  )

  // Student Signup action
  const signupStudent = useCallback(
    async (payload: StudentSignupPayload): Promise<AuthResponse> => {
      try {
        const response = await fetch('/api/auth/signup/student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = (await response.json()) as {
          message?: string
          error?: string
          token?: string
          user?: AuthUser
        }

        if (!response.ok) {
          return { success: false, error: data.error || 'Failed to create student account.' }
        }

        if (data.token && data.user) {
          setToken(data.token)
          setUser(data.user)

          try {
            localStorage.setItem(TOKEN_KEY, data.token)
            localStorage.setItem(ROLE_KEY, 'student')
            localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          } catch {
            // ignore
          }

          return { success: true, user: data.user, token: data.token }
        }

        return { success: false, error: 'Unexpected response from server.' }
      } catch (err) {
        console.error('[Auth Student Signup Error]:', err)
        return {
          success: false,
          error: 'Cannot connect to authentication server. Please check your connection.',
        }
      }
    },
    []
  )

  // Client Signup action
  const signupClient = useCallback(
    async (payload: ClientSignupPayload): Promise<AuthResponse> => {
      try {
        const response = await fetch('/api/auth/signup/client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = (await response.json()) as {
          message?: string
          error?: string
          token?: string
          user?: AuthUser
        }

        if (!response.ok) {
          return { success: false, error: data.error || 'Failed to create client account.' }
        }

        if (data.token && data.user) {
          setToken(data.token)
          setUser(data.user)

          try {
            localStorage.setItem(TOKEN_KEY, data.token)
            localStorage.setItem(ROLE_KEY, 'client')
            localStorage.setItem(USER_KEY, JSON.stringify(data.user))
            syncClientAuth(data.user)
          } catch {
            // ignore
          }

          return { success: true, user: data.user, token: data.token }
        }

        return { success: false, error: 'Unexpected response from server.' }
      } catch (err) {
        console.error('[Auth Client Signup Error]:', err)
        return {
          success: false,
          error: 'Cannot connect to authentication server. Please check your connection.',
        }
      }
    },
    []
  )

  // Google OAuth action
  const loginWithGoogle = useCallback(
    async (payload: SocialAuthPayload): Promise<AuthResponse> => {
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = (await response.json()) as {
          message?: string
          error?: string
          token?: string
          user?: AuthUser
        }

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Failed to authenticate with Google.',
          }
        }

        if (data.token && data.user) {
          setToken(data.token)
          setUser(data.user)

          try {
            localStorage.setItem(TOKEN_KEY, data.token)
            localStorage.setItem(ROLE_KEY, data.user.role)
            localStorage.setItem(USER_KEY, JSON.stringify(data.user))
            syncClientAuth(data.user)
          } catch {
            // ignore
          }

          return { success: true, user: data.user, token: data.token }
        }

        return { success: false, error: 'Unexpected response from server.' }
      } catch (err) {
        console.error('[Google Auth Error]:', err)
        return {
          success: false,
          error: 'Cannot connect to authentication server. Please check your connection.',
        }
      }
    },
    []
  )

  // GitHub OAuth action
  const loginWithGithub = useCallback(
    async (payload: SocialAuthPayload): Promise<AuthResponse> => {
      try {
        const response = await fetch('/api/auth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = (await response.json()) as {
          message?: string
          error?: string
          token?: string
          user?: AuthUser
        }

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Failed to authenticate with GitHub.',
          }
        }

        if (data.token && data.user) {
          setToken(data.token)
          setUser(data.user)

          try {
            localStorage.setItem(TOKEN_KEY, data.token)
            localStorage.setItem(ROLE_KEY, data.user.role)
            localStorage.setItem(USER_KEY, JSON.stringify(data.user))
            syncClientAuth(data.user)
          } catch {
            // ignore
          }

          return { success: true, user: data.user, token: data.token }
        }

        return { success: false, error: 'Unexpected response from server.' }
      } catch (err) {
        console.error('[GitHub Auth Error]:', err)
        return {
          success: false,
          error: 'Cannot connect to authentication server. Please check your connection.',
        }
      }
    },
    []
  )

  // Logout action
  const logout = useCallback(() => {
    const currentToken = token || localStorage.getItem(TOKEN_KEY)
    if (currentToken) {
      void fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch(() => {
        // ignore network error on logout
      })
    }

    setToken(null)
    setUser(null)

    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(CLIENT_AUTH_KEY)
    } catch {
      // ignore
    }
  }, [token])

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isAuthenticated,
      isLoading,
      login,
      signupStudent,
      signupClient,
      loginWithGoogle,
      loginWithGithub,
      logout,
      refreshUser,
    }),
    [
      user,
      token,
      role,
      isAuthenticated,
      isLoading,
      login,
      signupStudent,
      signupClient,
      loginWithGoogle,
      loginWithGithub,
      logout,
      refreshUser,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
