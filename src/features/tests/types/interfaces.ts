import { Child } from '@/features/children'

export interface TestResult {
  id: string

  assignment: TestAssignment

  score: number

  answers_json: string

  created_at: string
}

export interface Answer {
  id: string

  text: string

  score: number

  questionId: string
}

export interface Question {
  id: string

  content: string

  testId: string

  answers: Partial<Answer>[]
}

export interface TestAssignment {
  id: string

  child: Child

  testId: string

  due_date: string

  status: string
}

export interface Test {
  id: string

  title: string

  description: string

  questions: Question[]

  assignments: TestAssignment[]

  questionNo: number
}
