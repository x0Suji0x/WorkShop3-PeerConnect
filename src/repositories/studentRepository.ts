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
    let currentStudent = this.students.get(studentId)

    if (!currentStudent) {
      currentStudent = { ...cloneStudent(demoStudent), id: studentId }
      this.students.set(studentId, currentStudent)
    }

    const updatedStudent = { ...currentStudent, ...changes }
    this.students.set(studentId, cloneStudent(updatedStudent))
    return cloneStudent(updatedStudent)
  }
}

export const studentRepository: StudentRepository = new MockStudentRepository()
