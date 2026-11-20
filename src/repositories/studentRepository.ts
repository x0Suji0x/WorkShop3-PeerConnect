import { demoStudent } from '../data/studentMockData'
import type { Student } from '../types'

/**
 * Storage contract used by student-facing UI. Demo browsing uses the mock;
 * account profiles use the Supabase implementation behind the same boundary.
 */
export interface StudentRepository {
  getById: (studentId: string) => Promise<Student | null>
  update: (studentId: string, changes: StudentUpdate) => Promise<Student>
  getPublicProfiles: () => Promise<Student[]>
}

export type StudentUpdate = Partial<Omit<Student, 'id'>>

const cloneStudent = (student: Student): Student => structuredClone(student)

/**
 * Session-only mock repository. It intentionally does not write to localStorage
 * or an external service, so demo changes reset when the page is reloaded.
 */
class MockStudentRepository implements StudentRepository {
  private students = new Map<string, Student>([[demoStudent.id, cloneStudent(demoStudent)]])

  async getById(studentId: string) {
    const student = this.students.get(studentId)
    return student ? cloneStudent(student) : null
  }

  async update(studentId: string, changes: StudentUpdate) {
    const currentStudent = this.students.get(studentId)

    if (!currentStudent) {
      throw new Error(`Student profile "${studentId}" was not found.`)
    }

    const updatedStudent = { ...currentStudent, ...changes }
    this.students.set(studentId, cloneStudent(updatedStudent))
    return cloneStudent(updatedStudent)
  }

  async getPublicProfiles() {
    return []
  }
}

export const studentRepository: StudentRepository = new MockStudentRepository()
