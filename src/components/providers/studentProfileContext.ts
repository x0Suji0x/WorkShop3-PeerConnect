import { createContext } from 'react'
import type { StudentUpdate } from '../../repositories/studentRepository'
import type { Student } from '../../types'

export interface StudentProfileContextValue {
  student: Student
  isSaving: boolean
  updateStudent: (changes: StudentUpdate) => Promise<void>
}

export const StudentProfileContext = createContext<StudentProfileContextValue | null>(null)
