import { useTranslations } from 'next-intl'

export const backendMessageMap: Record<string, string> = {
  'Child created successfully': 'childCreated',
  'Child already exists in another school. Transfer requested.': 'transferRequested',
  'Deleted successfully': 'deleted',
  'Logged out': 'loggedOut',
  'Email verified successfully': 'emailVerified',
  'file uploaded successfully': 'fileUploaded',
  'Reminder sent successfully': 'reminderSent',
  'Verification email queued successfully': 'verificationEmailQueued',
  'child asigned successfully': 'childAssigned',
  'Child already exists in your school': 'childExists',
  'Child limit reached': 'childLimitReached',
  'Parent has reached the child limit': 'parentChildLimitReached',
  'Cannot transfer private child - only organization children can be transferred':
    'cannotTransferPrivate',
  'Cannot approve transfer for private child': 'cannotApprovePrivateTransfer',
  'Transfer request is already resolved': 'transferAlreadyResolved',
  'User already exists': 'userAlreadyExists',
  'Email already in use': 'emailInUse',
  'Phone number already in use': 'phoneInUse',
  'teacher already exits': 'teacherAlreadyExists',
  'Maximum attempts reached': 'maxAttemptsReached',
  'Attempt already approved': 'attemptAlreadyApproved',
  'Only submitted attempts can be approved': 'onlySubmittedCanBeApproved',
  'Attempt is locked': 'attemptLocked',
  'Finish or submit the current attempt before starting another': 'finishCurrentAttempt',
  'Retake is not allowed after approval': 'retakeNotAllowed',
  'No evaluation slot is available': 'noSlotAvailable',
  'Main attempt already started or completed for this child': 'mainAttemptStarted',
  'Complete the main attempt before retake': 'completeMainAttempt',
  'Retake already used': 'retakeAlreadyUsed',
  'Both free attempts must be completed before': 'freeAttemptsRequired',
  'An extra attempt is already in progress or awaiting payment': 'extraAttemptInProgress',
  'Extra attempt already awaiting approval': 'extraAttemptAwaitingApproval',
  'Extra attempt does not require approval': 'extraAttemptNoApproval',
  'Payment is not required for this attempt': 'paymentNotRequired',
  'No payment record linked to this attempt': 'noPaymentRecord',
  'This deal is closed': 'dealClosed',
  'Deal deadline has passed': 'dealDeadlinePassed',
  'Only selected proposals can be approved': 'onlySelectedProposals',
  'Organization is already approved': 'orgAlreadyApproved',
  'Organization is already rejected': 'orgAlreadyRejected',
  'Organization must be approved before performing this operation': 'orgMustBeApproved',
  'Duplicate dimension codes': 'duplicateDimensionCodes',
  'Dimension code not found': 'dimensionCodeNotFound',
  'Only SAR currency is supported': 'onlySARSupported',
  'Only failed or expired payments can be retried': 'onlyFailedCanRetry',
  'Maximum retries exceeded': 'maxRetriesExceeded',
  'Activity already has a start time': 'activityHasStartTime',
  'Insufficient role': 'insufficientRole',
  "you aren't allowed to access these data": 'noAccessToData',
  'Refresh token missing': 'refreshTokenMissing',
  'Session compromised': 'sessionCompromised',
  'Cannot logout this session': 'cannotLogoutSession',
  'Invalid token type': 'invalidTokenType',
  'Payment does not belong to this user': 'paymentNotOwned',
  'Something went wrong. Please try again.': 'somethingWentWrong',
  'Your organization must be approved before you can perform this action.': 'orgApprovalRequired',
  'Your session has expired. Please sign in again.': 'sessionExpired',
  'You do not have permission to perform this action.': 'noPermission',
  'The requested resource was not found.': 'notFound',
  'This organization status has already changed. Please refresh.': 'orgStatusChanged',
  'This flow is no longer available. Please use evaluations instead.': 'flowNotAvailable',
  'Unable to create child': 'unableToCreateChild',
  'Unable to search parent': 'unableToSearchParent',
  'Unable to load child': 'unableToLoadChild',
  'Unable to request transfer': 'unableToRequestTransfer',
}

type TranslateFn = (key: string, values?: Record<string, string | number>) => string

const dynamicPatterns: {
  pattern: RegExp
  keyTemplate: (match: RegExpMatchArray) => { key: string; params: Record<string, string> }
}[] = [
  {
    pattern: /^Parent has reached the child limit \((\d+)\)/,
    keyTemplate: (m) => ({ key: 'parentChildLimitReachedWithMax', params: { max: m[1] } }),
  },
  {
    pattern: /^Duplicate dimension codes: (.+)$/,
    keyTemplate: (m) => ({ key: 'duplicateDimensionCodesWithValue', params: { codes: m[1] } }),
  },
  {
    pattern: /^Dimension code "(.+)" not found$/,
    keyTemplate: (m) => ({ key: 'dimensionCodeNotFoundWithValue', params: { code: m[1] } }),
  },
]

export function translateBackendMessage(msg: string, t: TranslateFn): string {
  const exact = backendMessageMap[msg]
  if (exact) return t(exact)

  for (const { pattern, keyTemplate } of dynamicPatterns) {
    const match = msg.match(pattern)
    if (match) {
      const { key, params } = keyTemplate(match)
      return t(key, params)
    }
  }

  return msg
}

export function useTranslateBackend() {
  const t = useTranslations('apiErrors')
  return (msg: string) => translateBackendMessage(msg, t)
}
