import { describe,expect,it,vi } from 'vitest'
import { resolveAuthCallback } from './callback'

describe('resolveAuthCallback',()=>{
 it('assigns intended role only when profile role is null and clears intent',async()=>{const chooseRole=vi.fn(async()=>{}),clearIntent=vi.fn();const r=await resolveAuthCallback({currentRole:null,intendedRole:'student',returnPath:'/dashboard',chooseRole,clearIntent});expect(chooseRole).toHaveBeenCalledWith('student');expect(r.destination).toBe('/dashboard');expect(clearIntent).toHaveBeenCalledOnce()})
 it('does not overwrite a role already chosen',async()=>{const chooseRole=vi.fn(async()=>{});const r=await resolveAuthCallback({currentRole:'client',intendedRole:'student',returnPath:null,chooseRole,clearIntent:()=>{}});expect(chooseRole).not.toHaveBeenCalled();expect(r.destination).toBe('/dashboard')})
 it('sends users without a valid role or intent to role choice',async()=>{for(const intent of [null,'admin']){const r=await resolveAuthCallback({currentRole:null,intendedRole:intent,returnPath:null,chooseRole:async()=>{},clearIntent:()=>{}});expect(r.destination).toBe('/auth/choose-role')}})
 it('shows OAuth errors and clears intent without choosing a role',async()=>{const chooseRole=vi.fn(async()=>{}),clearIntent=vi.fn();const r=await resolveAuthCallback({oauthError:'access_denied',currentRole:null,intendedRole:'client',returnPath:null,chooseRole,clearIntent});expect(r).toEqual({destination:'/signin',error:'access_denied'});expect(chooseRole).not.toHaveBeenCalled();expect(clearIntent).toHaveBeenCalledOnce()})
})
