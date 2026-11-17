import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { demoStudent } from '../../data/studentMockData'
import { studentRepository, type StudentUpdate } from '../../repositories/studentRepository'
import type { Student } from '../../types'
import { StudentProfileContext } from './studentProfileContext'

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student>(demoStudent)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    void studentRepository.getById(demoStudent.id).then((storedStudent) => {
      if (storedStudent) setStudent(storedStudent)
    })
  }, [])

  const updateStudent = useCallback(async (changes: StudentUpdate) => {
    setIsSaving(true)

    try {
      const updatedStudent = await studentRepository.update(student.id, changes)
      setStudent(updatedStudent)
    } finally {
      setIsSaving(false)
    }
  }, [student.id])

  const value = useMemo(() => ({ student, isSaving, updateStudent }), [student, isSaving, updateStudent])

  return <StudentProfileContext.Provider value={value}>{children}</StudentProfileContext.Provider>
}
