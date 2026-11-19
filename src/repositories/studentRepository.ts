import { demoStudent } from '../data/studentMockData'
import type { Student } from '../types'

/**
 * Contract used by student-facing UI. Replace the mock implementation with an
 * API-backed repository later; pages should not need to change.
 */
export interface StudentRepository {
  getById: (studentId: string) => Promise<Student | null>
  update: (studentId: string, changes: StudentUpdate) => Promise<Student>
}

export type StudentUpdate = Partial<Omit<Student, 'id'>>

const cloneStudent = (student: Student): Student => structuredClone(student)

const STORAGE_KEY = 'peerconnect_student_profile_'

/**
 * Persistent local student repository using browser storage.
 */
class LocalStudentRepository implements StudentRepository {
  private students = new Map<string, Student>([[demoStudent.id, cloneStudent(demoStudent)]])

  async getById(studentId: string) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + studentId)
      if (saved) return JSON.parse(saved) as Student
    } catch {
      // ignore
    }
    const student = this.students.get(studentId)
    return student ? cloneStudent(student) : null
  }

  async update(studentId: string, changes: StudentUpdate) {
    let currentStudent = await this.getById(studentId)

    if (!currentStudent) {
      currentStudent = { ...cloneStudent(demoStudent), id: studentId }
    }

    const updatedStudent = { ...currentStudent, ...changes }
    this.students.set(studentId, cloneStudent(updatedStudent))
    try {
      localStorage.setItem(STORAGE_KEY + studentId, JSON.stringify(updatedStudent))
    } catch {
      // ignore
    }
    return cloneStudent(updatedStudent)
  }
}

export const studentRepository: StudentRepository = new LocalStudentRepository()
