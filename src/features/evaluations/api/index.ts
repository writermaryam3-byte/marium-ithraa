import { api } from '@/lib/api/api'
import { Endpoint, Methods } from '@/lib/types/enums'
import {
  ChildType,
  Evaluation,
  CreateEvaluationPayload,
  AvailableEvaluationsResponse,
  StartEvaluationPayload,
  EvaluationAttempt,
  AttemptsResponse,
  SaveAttemptProgressPayload,
  SubmitAttemptPayload,
} from '@/lib/types/types/interfaces'
export type OwnerEvaluationFiltersResponse = {
  classes: {
    id: string
    name: string
  }[]
  evaluations: {
    id: string
    title: string
    type: string
    ageFrom?: number | null
    ageTo?: number | null
  }[]
}

export type OwnerEvaluationReportsResponse = {
  reports: {
    classId: string
    className: string
    evaluationId: string | null
    evaluationTitle: string
    title: string
    childrenCount: number
    evaluatedCount: number
    reportDate: string
  }[]
}

export type OwnerClassEvaluationSummary = {
  classId: string
  className: string
  evaluationId: string
  evaluationTitle: string
  evaluationType: string
  totalChildren: number
  approvedCount: number
  submittedCount: number
  inProgressCount: number
  notStartedCount: number
  highestScore: number | null
  averageScore: number | null
  lowestScore: number | null
  topDimensions: {
    code: string
    name: string
    score: number
    percentage: number | null
  }[]
  children: {
    organizationChildId: string | null
    privateChildId: string | null
    childName: string
    className: string
    status: 'not_started' | 'in_progress' | 'submitted' | 'approved'
    statusLabel: string
    attemptId: string | null
    score: number | null
    topResultLabel: string | null
    topDimensionName: string | null
    topDimensionPercentage: number | null
  }[]
}

export type OwnerClassEvaluationStatus = {
  classId: string
  className: string
  evaluationId: string
  evaluationTitle: string
  children: {
    organizationChildId: string | null
    privateChildId: string | null
    childName: string
    className: string
    status: 'not_started' | 'in_progress' | 'submitted' | 'approved'
    statusLabel: string
    lastAttemptId: string | null
    canSendReminder: boolean
  }[]
}

export type OwnerEvaluationReportCard = {
  classId: string
  className: string
  title: string
  childrenCount: number
  reportDate: string
}

export type GetAttemptsFilters = {
  status?: string
  evaluationId?: string
  organizationChildId?: string
  privateChildId?: string
}

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()

  return query ? `?${query}` : ''
}

/**
 * =========================
 * Evaluations - Admin
 * =========================
 */

export const getEvaluations = async () => {
  return api.server<Evaluation[]>(`/${Endpoint.EVALUATIONS}`)
}

export const getEvaluationsClient = async () => {
  return api.client<Evaluation[]>(`/${Endpoint.EVALUATIONS}`)
}

export const createEvaluation = async (data: CreateEvaluationPayload) => {
  return api.server<Evaluation>(`/${Endpoint.EVALUATIONS}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const createEvaluationClient = async (data: CreateEvaluationPayload) => {
  return api.client<Evaluation>(`/${Endpoint.EVALUATIONS}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const getEvaluationDetails = async (evaluationId: string) => {
  return api.server<Evaluation>(`/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.DETAILS}`)
}

export const getEvaluationDetailsClient = async (evaluationId: string) => {
  return api.client<Evaluation>(`/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.DETAILS}`)
}

/**
 * =========================
 * Evaluations - Parent/Form
 * =========================
 */

export const getEvaluationForm = async (evaluationId: string) => {
  return api.server<Evaluation>(`/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.FORM}`)
}

export const getEvaluationFormClient = async (evaluationId: string) => {
  return api.client<Evaluation>(`/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.FORM}`)
}

export const getAvailableEvaluationsForChild = async (childId: string) => {
  return api.server<AvailableEvaluationsResponse>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.AVAILABLE}/${childId}`,
  )
}

export const getAvailableEvaluationsForChildClient = async (childId: string) => {
  return api.client<AvailableEvaluationsResponse>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.AVAILABLE}/${childId}`,
  )
}

export const startEvaluation = async (evaluationId: string, data: StartEvaluationPayload) => {
  return api.server<EvaluationAttempt>(
    `/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.START}`,
    {
      method: Methods.POST,
      body: JSON.stringify(data),
    },
  )
}

export const startEvaluationClient = async (evaluationId: string, data: StartEvaluationPayload) => {
  return api.client<EvaluationAttempt>(
    `/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.START}`,
    {
      method: Methods.POST,
      body: JSON.stringify(data),
    },
  )
}

/**
 * =========================
 * Attempts - Admin/Parent
 * =========================
 */

export const getAttempts = async (filters?: GetAttemptsFilters) => {
  const query = buildQueryString({
    status: filters?.status,
    evaluationId: filters?.evaluationId,
    organizationChildId: filters?.organizationChildId,
    privateChildId: filters?.privateChildId,
  })

  return api.server<AttemptsResponse>(`/${Endpoint.ATTEMPTS}${query}`)
}

export const getAttemptsClient = async (filters?: GetAttemptsFilters) => {
  const query = buildQueryString({
    status: filters?.status,
    evaluationId: filters?.evaluationId,
    organizationChildId: filters?.organizationChildId,
    privateChildId: filters?.privateChildId,
  })

  return api.client<AttemptsResponse>(`/${Endpoint.ATTEMPTS}${query}`)
}

export const getAttemptById = async (attemptId: string) => {
  return api.server<EvaluationAttempt>(`/${Endpoint.ATTEMPTS}/${attemptId}`)
}

export const getAttemptByIdClient = async (attemptId: string) => {
  return api.client<EvaluationAttempt>(`/${Endpoint.ATTEMPTS}/${attemptId}`)
}

export const getAttemptsForChild = async (childId: string) => {
  return api.server<AttemptsResponse>(`/${Endpoint.ATTEMPTS}/${Endpoint.CHILD}/${childId}`)
}

export const getAttemptsForChildClient = async (childId: string) => {
  return api.client<AttemptsResponse>(`/${Endpoint.ATTEMPTS}/${Endpoint.CHILD}/${childId}`)
}

export const saveAttemptProgress = async (attemptId: string, data: SaveAttemptProgressPayload) => {
  return api.server<EvaluationAttempt>(`/${Endpoint.ATTEMPTS}/${attemptId}/${Endpoint.SAVE}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const saveAttemptProgressClient = async (
  attemptId: string,
  data: SaveAttemptProgressPayload,
) => {
  return api.client<EvaluationAttempt>(`/${Endpoint.ATTEMPTS}/${attemptId}/${Endpoint.SAVE}`, {
    method: Methods.PATCH,
    body: JSON.stringify(data),
  })
}

export const submitAttempt = async (attemptId: string, data: SubmitAttemptPayload) => {
  return api.server<EvaluationAttempt>(`/${Endpoint.ATTEMPTS}/${attemptId}/${Endpoint.SUBMIT}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const submitAttemptClient = async (attemptId: string, data: SubmitAttemptPayload) => {
  return api.client<EvaluationAttempt>(`/${Endpoint.ATTEMPTS}/${attemptId}/${Endpoint.SUBMIT}`, {
    method: Methods.POST,
    body: JSON.stringify(data),
  })
}

export const approveAttempt = async (attemptId: string) => {
  return api.server<EvaluationAttempt>(`/${Endpoint.ATTEMPTS}/${attemptId}/${Endpoint.APPROVE}`, {
    method: Methods.POST,
  })
}

export const approveAttemptClient = async (attemptId: string) => {
  return api.client<EvaluationAttempt>(`/${Endpoint.ATTEMPTS}/${attemptId}/${Endpoint.APPROVE}`, {
    method: Methods.POST,
  })
}

/**
 * =========================
 * Private Child Attempt Slots
 * =========================
 */

export const openPrivateMainSlot = async (childId: string) => {
  return api.server(`/${Endpoint.ATTEMPTS}/${childId}/${Endpoint.START}`, {
    method: Methods.POST,
  })
}

export const openPrivateMainSlotClient = async (childId: string) => {
  return api.client(`/${Endpoint.ATTEMPTS}/${childId}/${Endpoint.START}`, {
    method: Methods.POST,
  })
}

export const requestPrivateRetake = async (childId: string) => {
  return api.server(`/${Endpoint.ATTEMPTS}/${childId}/${Endpoint.RETAKE}`, {
    method: Methods.POST,
  })
}

export const requestPrivateRetakeClient = async (childId: string) => {
  return api.client(`/${Endpoint.ATTEMPTS}/${childId}/${Endpoint.RETAKE}`, {
    method: Methods.POST,
  })
}

export const requestPrivateExtraAttempt = async (childId: string) => {
  return api.server(`/${Endpoint.ATTEMPTS}/${childId}/${Endpoint.REQUEST_EXTRA}`, {
    method: Methods.POST,
  })
}

export const requestPrivateExtraAttemptClient = async (childId: string) => {
  return api.client(`/${Endpoint.ATTEMPTS}/${childId}/${Endpoint.REQUEST_EXTRA}`, {
    method: Methods.POST,
  })
}

export const getOwnerEvaluationFilters = async () => {
  return api.server<OwnerEvaluationFiltersResponse>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.FILTERS}`,
  )
}

export const getOwnerEvaluationFiltersClient = async () => {
  return api.client<OwnerEvaluationFiltersResponse>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.FILTERS}`,
  )
}

export const getOwnerEvaluationReports = async (evaluationId?: string) => {
  const query = evaluationId ? `?evaluationId=${evaluationId}` : ''

  return api.server<OwnerEvaluationReportsResponse>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.REPORTS}${query}`,
  )
}

export const getOwnerEvaluationReportsClient = async (evaluationId?: string) => {
  const query = evaluationId ? `?evaluationId=${evaluationId}` : ''

  return api.client<OwnerEvaluationReportsResponse>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.REPORTS}${query}`,
  )
}

export const getOwnerClassEvaluationSummary = async (classId: string, evaluationId: string) => {
  return api.server<OwnerClassEvaluationSummary>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CLASSES}/${classId}/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.SUMMARY}`,
  )
}

export const getOwnerClassEvaluationSummaryClient = async (
  classId: string,
  evaluationId: string,
) => {
  return api.client<OwnerClassEvaluationSummary>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CLASSES}/${classId}/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.SUMMARY}`,
  )
}

export const getOwnerClassEvaluationStatus = async (classId: string, evaluationId: string) => {
  return api.server<OwnerClassEvaluationStatus>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CLASSES}/${classId}/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.STATUS}`,
  )
}

export const getOwnerClassEvaluationStatusClient = async (
  classId: string,
  evaluationId: string,
) => {
  return api.client<OwnerClassEvaluationStatus>(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CLASSES}/${classId}/${Endpoint.EVALUATIONS}/${evaluationId}/${Endpoint.STATUS}`,
  )
}

export const sendOwnerEvaluationReminder = async (childId: string) => {
  return api.server(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CHILDREN}/${childId}/${Endpoint.REMINDER}`,
    {
      method: Methods.POST,
    },
  )
}

export const sendOwnerEvaluationReminderClient = async (childId: string) => {
  return api.client(
    `/${Endpoint.EVALUATIONS}/${Endpoint.OWNER}/${Endpoint.CHILDREN}/${childId}/${Endpoint.REMINDER}`,
    {
      method: Methods.POST,
    },
  )
}
