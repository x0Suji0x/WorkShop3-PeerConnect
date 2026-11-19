import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LoadingState } from '../common/LoadingState'
import { useAuth } from '../../lib/auth/AuthProvider'
import { sanitizeReturnPath, type AccountRole } from '../../lib/auth/helpers'

function AuthUnavailable(){return <main className="mx-auto max-w-xl p-12 text-center"><h1 className="text-2xl font-bold">Sign-in isn’t configured</h1><p className="mt-3">Add the Supabase URL and publishable key to configure authentication.</p></main>}
export function ProtectedRoute({children,role}:{children:ReactNode;role?:AccountRole}){const auth=useAuth(),loc=useLocation();if(auth.status==='loading')return <LoadingState label="Checking your account…"/>;if(auth.status==='profileError')return <main className="mx-auto max-w-xl p-12 text-center"><h1>Couldn't load your profile</h1><p>{auth.profileError}</p><button type="button" onClick={()=>void auth.refreshProfile().catch(()=>{})}>Retry</button></main>;if(auth.status==='unconfigured')return <AuthUnavailable/>;if(auth.status==='signedOut')return <Navigate replace to={`/signin?next=${encodeURIComponent(sanitizeReturnPath(loc.pathname+loc.search+loc.hash)??'/dashboard')}`}/>;if(!auth.profile)return <LoadingState label="Loading your profile…"/>;if(!auth.profile.role)return <Navigate replace to="/auth/choose-role"/>;if(role&&auth.profile.role!==role)return <RoleDenied role={role}/>;return <>{children}</>}
export function RoleRoute({children,role}:{children:ReactNode;role:AccountRole}){return <ProtectedRoute role={role}>{children}</ProtectedRoute>}
function RoleDenied({role}:{role:AccountRole}){return <main className="mx-auto max-w-xl p-12 text-center"><h1 className="text-2xl font-bold">This page is for {role} accounts</h1><p className="mt-3">Your account doesn’t have access to this page.</p></main>}
