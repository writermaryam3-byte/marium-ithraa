export enum Directions {
  RTL = 'rtl',
  LTR = 'ltr',
}

export enum Languages {
  ENGLISH = 'en',
  ARABIC = 'ar',
}

export enum Routes {
  ROOT = '',
  AUTH = 'auth',
  DASHBOARDS = 'dashboards',
  UNAUTHORIZED = 'unauthorized',
  CHOSEROLE = 'chose-role',
  EMAILVERIFICATION = 'email-verification',
  NOTIFICATIONS = 'notifications',
}

export enum Pages {
  USERS = 'users',
  NEW = 'new',
  TESTS = 'tests',
  LOGIN = 'login',
  BENEFICIARYSIGNUP = 'Beneficiarysignup',
  ADMIN = 'admin',
  ORGANIZATION = 'organization',
  EMPLOYEES = 'employees',
  TEACHER = 'teacher',
  CHILDREN = 'children',
  PARENT = 'parent',
  ENRICHER = 'enricher',
  DEALS = 'deals',
  PROPOSALS = 'proposals',
}

export enum AccountType {
  PARENT = 'parent',
  TEACHER = 'teacher',
  ORGANIZATION = 'organization',
  ENRICHER = 'enricher',
}

export enum InputTypes {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  DATE_TIME_LOCAL = 'datetime-local',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  FILE = 'file',
  IMAGE = 'image',
  COLOR = 'color',
  RANGE = 'range',
  TEL = 'tel',
  URL = 'url',
  SEARCH = 'search',
  MONTH = 'month',
  WEEK = 'week',
  HIDDEN = 'hidden',
  MULTI_SELECT = 'multi select',
  MARKDOWN = 'markdown',
}

export enum StatusCode {
  BADREQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOTFOUND = 404,
  CONFLICT = 409,
  GONE = 410,
  OK = 200,
  CREATED = 201,
  INTERNALSERVERERROR = 500,
}
export enum Navigate {
  NEXT = 'next',
  PREV = 'prev',
}
export enum Responses {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  STATUS = 'status',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

export enum AuthMessages {
  LOGIN_SUCCESS = 'Login successfully',
  LOGOUT_SUCCESS = 'Logout successfully',
  REGISTER_SUCCESS = 'Register successfully',
  FORGET_PASSWORD_SUCCESS = 'Forget password successfully',
  RESET_PASSWORD_SUCCESS = 'Reset password successfully',
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum Environments {
  PROD = 'production',
  DEV = 'development',
}
export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANIZATIONOWNER = 'ORGANIZATIONOWNER',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  ENRICHER = 'ENRICHER',
}

export enum FormTypes {
  SIGNIN = 'SIGNIN',
  EMPLOYEE = 'EMPLOYEE',
  EMPLOYEE_UPDATE = 'EMPLOYEE_UPDATE',
  TEACHER = 'teacher',
  TEACHER_UPDATE = 'teacherUpdate',
  GRADE = 'grade',
  GRADE_UPDATE = 'gradeUpdate',
  CLASS = 'class',
  CLASS_UPDATE = 'classUpdate',
  CHILD_ORG = 'childOrg',
  CHILD_UPDATE = 'childUpdate',
  CHILD_PRIVATE = 'childPrivate',
  CHILD_ADMIN = 'childAdmin',
  TEST = 'TESTS',
}

export enum OrganizationType {
  CENTER = 'center',
  NURSERY = 'nursery',
  TRAINING = 'training',
  SCHOOL = 'school',
}
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum Endpoint {
  EVALUATIONS = 'evaluations',
  ATTEMPTS = 'attempts',
  AVAILABLE = 'available',
  DETAILS = 'details',
  FORM = 'form',
  CHILD = 'child',
  APPROVE = 'approve',
  SAVE = 'save',
  SUBMIT = 'submit',
  START = 'start',
  RETAKE = 'retake',
  REQUEST_EXTRA = 'request-extra',
  TRANSFERS = 'child-transfers',
  PAYMENTS = 'payments',
  INITIATE = 'initiate',
  RETRY = 'retry',
  TEACHERS = 'teachers',
  MAILER = 'mailer',
  VERIFYEMAIL = 'verify-email',
  ROLES = 'roles',
  ORGANIZATIONOWNER = 'organization-owner',
  TESTS = 'tests',
  ALL = 'all',
  AUTH = 'auth',
  BENEFICIARIESSIGNUP = 'beneficiaries-signup',
  ENRICHERS_SIGNUP = 'enrichers-signup',
  PARENT_SIGNUP = 'parent-signup',
  EMPLOYEES = 'employees',
  EMPLOYEESBYORGNIZATION = `${EMPLOYEES}/organization`,
  USERS = 'users',
  ORGANIZATIONS = 'organizations',
  ME = 'me',
  PENDING = 'pending',
  REJECT = 'reject',
  CHILDREN = 'children',
  GRADES = 'grades',
  PARENT = 'parent',
  OWNER = 'owner',
  REPORTS = 'reports',
  STATUS = 'status',
  SUMMARY = 'summary',
  REMINDER = 'reminder',
  CLASSES = 'classes',
  FILTERS = 'filters',
  NOTIFICATIONS = 'notifications',
  UNREAD_COUNT = 'unread-count',
  READ_ALL = 'read-all',
  READ = 'read',
  DISPATCH = 'dispatch',
  DEALS = 'deals',
  PROPOSALS = 'proposals',
  ACTIVITIES = 'activities',
  ENRICHERS = 'enrichers',
  ORG_CHILDREN = 'org-children',
  SELECT = 'select',
  ASSIGN = 'asign',
  GET_CHILDREN = 'get-children',
  WITH_DEALS = 'with-deals',
  WEBHOOK = 'webhook',
  UPLOADS = 'uploads',
  SEARCH = 'search',
  CAPACITY_REQUESTS = 'capacity-requests',
}

export enum ApiErrorCodes {
  ORGANIZATION_ALREADY_EXISTS = 'ORGANIZATION_ALREADY_EXISTS',
  GRADE_ALREADY_EXISTS = 'GRADE_ALREADY_EXISTS',
  CLASS_ALREADY_EXISTS = 'CLASS_ALREADY_EXISTS',
  SUBJECT_ALREADY_EXISTS = 'SUBJECT_ALREADY_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  UNAUTHORIZED = 'UNAUTHORIZED',

  FORBIDDEN = 'FORBIDDEN',

  NOT_FOUND = 'NOT_FOUND',

  CONFLICT = 'CONFLICT',

  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',

  PHONE_ALREADY_EXISTS = 'PHONE_ALREADY_EXISTS',

  PAYMENT_FAILED = 'PAYMENT_FAILED',

  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED',

  CLASS_FULL = 'CLASS_FULL',

  CHILD_ALREADY_ASSIGNED = 'CHILD_ALREADY_ASSIGNED',

  SESSION_EXPIRED = 'SESSION_EXPIRED',
}
