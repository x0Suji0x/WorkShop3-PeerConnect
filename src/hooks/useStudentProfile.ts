import { useContext } from 'react'
import { StudentProfileContext } from '../components/providers/studentProfileContext'

export function useStudentProfile() {
  const context = useContext(StudentProfileContext)

  if (!context) {
    throw new Error('useStudentProfile must be used within StudentProfileProvider.')
  }

  return context
}
