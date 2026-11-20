import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type VerificationKind = 'student' | 'business'
export type VerificationRequestStatus = 'pending' | 'approved' | 'rejected'

export interface VerificationRequest {
  id: string
  userId: string
  kind: VerificationKind
  institutionOrCompany: string
  officialEmail: string
  evidenceNotes: string
  status: VerificationRequestStatus
  reviewerNote: string | null
  createdAt: string
  reviewedAt: string | null
}

export interface VerificationRequestInput {
  institutionOrCompany: string
  officialEmail: string
  evidenceNotes: string
}

interface VerificationRequestRow {
  id: string
  user_id: string
  kind: VerificationKind
  institution_or_company: string
  official_email: string
  evidence_notes: string
  status: VerificationRequestStatus
  reviewer_note: string | null
  created_at: string
  reviewed_at: string | null
}

const fields = 'id,user_id,kind,institution_or_company,official_email,evidence_notes,status,reviewer_note,created_at,reviewed_at'

function fromRow(row: VerificationRequestRow): VerificationRequest {
  return {
    id: row.id,
    userId: row.user_id,
    kind: row.kind,
    institutionOrCompany: row.institution_or_company,
    officialEmail: row.official_email,
    evidenceNotes: row.evidence_notes,
    status: row.status,
    reviewerNote: row.reviewer_note,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  }
}

function requireClient(client: SupabaseClient | null): SupabaseClient {
  if (!client) throw new Error('Verification requests are not configured.')
  return client
}

export function createVerificationRepository(client: SupabaseClient | null) {
  return {
    async getMine(userId: string): Promise<VerificationRequest | null> {
      const supabaseClient = requireClient(client)
      const { data, error } = await supabaseClient
        .from('verification_requests')
        .select(fields)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
      if (error) throw new Error('Could not load your verification request. Please try again.')
      const latest = (data ?? [])[0] as VerificationRequestRow | undefined
      return latest ? fromRow(latest) : null
    },

    async submit(
      userId: string,
      kind: VerificationKind,
      input: VerificationRequestInput,
    ): Promise<VerificationRequest> {
      const supabaseClient = requireClient(client)
      const { data, error } = await supabaseClient
        .from('verification_requests')
        .insert({
          user_id: userId,
          kind,
          institution_or_company: input.institutionOrCompany.trim(),
          official_email: input.officialEmail.trim(),
          evidence_notes: input.evidenceNotes.trim(),
        })
        .select(fields)
        .single()
      if (error || !data) {
        if (error?.message?.includes('verification_requests_one_pending_per_user_idx')) {
          throw new Error('You already have a request waiting for review.')
        }
        throw new Error('Could not submit your verification request. Please try again.')
      }
      return fromRow(data as VerificationRequestRow)
    },

    async isVerified(userId: string, kind: VerificationKind): Promise<boolean> {
      const supabaseClient = requireClient(client)
      const { data, error } = await supabaseClient
        .from('verified_users')
        .select('user_id')
        .eq('user_id', userId)
        .eq('kind', kind)
        .maybeSingle()
      if (error) throw new Error('Could not load your verification status. Please try again.')
      return Boolean(data)
    },
  }
}

export const verificationRepository = createVerificationRepository(supabase)
