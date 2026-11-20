import { parseRole, sanitizeReturnPath, type AccountRole } from './helpers'

export async function resolveAuthCallback(input: {
  oauthError?: string | null
  currentRole: AccountRole | null
  intendedRole: string | null
  returnPath: string | null
  chooseRole: (role: AccountRole) => Promise<void>
  clearIntent: () => void
}): Promise<{ destination: string; error?: string }> {
  if (input.oauthError) {
    input.clearIntent()
    return { destination: '/signin', error: input.oauthError }
  }

  let role = input.currentRole
  const intended = parseRole(input.intendedRole)
  if (!role && intended) {
    await input.chooseRole(intended)
    role = intended
  }

  input.clearIntent()
  const destination = role
    ? sanitizeReturnPath(input.returnPath) || '/dashboard'
    : '/auth/choose-role'

  return { destination }
}
