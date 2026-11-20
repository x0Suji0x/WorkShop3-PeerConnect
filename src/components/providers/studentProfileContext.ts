import { createContext } from 'react'
import type { StudentUpdate } from '../../repositories/studentRepository'
import type { Student } from '../../types'

export interface StudentProfileContextValue {
  student: Student
  isSaving: boolean
  isLoadingProfile: boolean
  profileError: string | null
  profileMode: 'demo' | 'account'
  needsProfileCompletion: boolean
  updateStudent: (changes: StudentUpdate) => Promise<void>
  refreshStudentProfile: () => Promise<void>
}

export const StudentProfileContext = createContext<StudentProfileContextValue | null>(null)
