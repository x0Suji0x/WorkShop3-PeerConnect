// @vitest-environment jsdom
import { describe,expect,it,vi,beforeEach,afterEach } from 'vitest'
import { cleanup,render,screen } from '@testing-library/react'
import { MemoryRouter,Route,Routes,useLocation } from 'react-router-dom'
import { ProtectedRoute,RoleRoute } from './RouteGuards'

const mockUseAuth=vi.hoisted(()=>vi.fn())
vi.mock('../../lib/auth/AuthProvider',()=>({useAuth:mockUseAuth}))
const Location=()=>{const loc=useLocation();return <output data-testid="location">{loc.pathname+loc.search}</output>}
const profile=(role:'student'|'client'|null)=>({id:'u1',role,full_name:'Test',company_name:null,avatar_url:null})
function setup(auth:Record<string,unknown>, guard:'protected'|'student'='protected',path='/projects/new?x=1') {mockUseAuth.mockReturnValue(auth);return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/signin" element={<p data-testid="signin-marker">sign in target</p>}/><Route path="/auth/choose-role" element={<p data-testid="role-marker">role target</p>}/><Route path="*" element={<>{guard==='student'?<RoleRoute role="student"><p>private child</p></RoleRoute>:<ProtectedRoute><p>private child</p></ProtectedRoute>}<Location/></>}/></Routes></MemoryRouter>)}
describe('ProtectedRoute and RoleRoute',()=>{
 beforeEach(()=>vi.clearAllMocks())
 afterEach(()=>cleanup())
 it('shows loading state',()=>{setup({status:'loading',profile:null});expect(screen.getByText('Checking your account…')).toBeTruthy()})
 it('waits for a signed-in profile still loading without redirecting',()=>{setup({status:'loading',profile:null,user:{id:'u1'}});expect(screen.getByText('Checking your account…')).toBeTruthy();expect(screen.queryByTestId('signin-marker')).toBeNull();expect(screen.queryByTestId('role-marker')).toBeNull()})
 it('shows unconfigured message',()=>{setup({status:'unconfigured',profile:null});expect(screen.getByText(/sign-in isn’t configured/i)).toBeTruthy()})
 it('redirects signed-out users with the current path as next',()=>{setup({status:'signedOut',profile:null});expect(screen.getByTestId('signin-marker')).toBeTruthy()})
 it('sends a signed-in user with no role to role selection',()=>{setup({status:'signedIn',profile:profile(null)});expect(screen.getByTestId('role-marker')).toBeTruthy()})
 it('shows profile error with a retry action',()=>{const retry=vi.fn(async()=>{});setup({status:'profileError',profile:null,profileError:'Network unavailable',refreshProfile:retry});expect(screen.getByText('Network unavailable')).toBeTruthy();screen.getByText('Retry').click();expect(retry).toHaveBeenCalledOnce()})
 it('denies the wrong role without rendering protected content',()=>{setup({status:'signedIn',profile:profile('client')},'student');expect(screen.getByText('This page is for student accounts')).toBeTruthy();expect(screen.queryByText('private child')).toBeNull()})
 it('renders children for the correct role',()=>{setup({status:'signedIn',profile:profile('student')},'student');expect(screen.getByText('private child')).toBeTruthy()})
})
