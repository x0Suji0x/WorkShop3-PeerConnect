// @vitest-environment jsdom
import { describe,expect,it,vi,beforeEach } from 'vitest'
import { render,screen,waitFor } from '@testing-library/react'
import { MemoryRouter,Route,Routes,useLocation } from 'react-router-dom'
import { ProtectedRoute,RoleRoute } from './RouteGuards'

const mockUseAuth=vi.hoisted(()=>vi.fn())
vi.mock('../../lib/auth/AuthProvider',()=>({useAuth:mockUseAuth}))
const Location=()=>{const loc=useLocation();return <output data-testid="location">{loc.pathname+loc.search}</output>}
const profile=(role:'student'|'client'|null)=>({id:'u1',role,full_name:'Test',company_name:null,avatar_url:null})
function setup(auth:Record<string,unknown>, guard:'protected'|'student'='protected',path='/projects/new?x=1') {mockUseAuth.mockReturnValue(auth);return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="*" element={<>{guard==='student'?<RoleRoute role="student"><p>private child</p></RoleRoute>:<ProtectedRoute><p>private child</p></ProtectedRoute>}<Location/></>}/></Routes></MemoryRouter>)}
describe('ProtectedRoute and RoleRoute',()=>{
 beforeEach(()=>vi.clearAllMocks())
 it('shows loading state',()=>{setup({status:'loading',profile:null});expect(screen.getByText('Checking your account…')).toBeTruthy()})
 it('shows unconfigured message',()=>{setup({status:'unconfigured',profile:null});expect(screen.getByText(/sign-in isn’t configured/i)).toBeTruthy()})
 it('redirects signed-out users with the current path as next',async()=>{setup({status:'signedOut',profile:null});await waitFor(()=>expect(screen.getByTestId('location').textContent).toBe('/signin?next=%2Fprojects%2Fnew%3Fx%3D1'))})
 it('sends a signed-in user with no role to role selection',async()=>{setup({status:'signedIn',profile:profile(null)});await waitFor(()=>expect(screen.getByTestId('location').textContent).toBe('/auth/choose-role'))})
 it('denies the wrong role without rendering protected content',()=>{setup({status:'signedIn',profile:profile('client')},'student');expect(screen.getByText('This page is for student accounts')).toBeTruthy();expect(screen.queryByText('private child')).toBeNull()})
 it('renders children for the correct role',()=>{setup({status:'signedIn',profile:profile('student')},'student');expect(screen.getByText('private child')).toBeTruthy()})
})
