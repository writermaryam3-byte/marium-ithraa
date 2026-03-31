
export enum Directions {
  RTL = "rtl",
  LTR = "ltr",
}

export enum Languages {
  ENGLISH = "en",
  ARABIC = "ar",
}

export enum Routes {
  ROOT = "",
  AUTH = "auth",
  DASHBOARDS = "dashboards",
  UNAUTHARIZED = "unautharized",
  CHOSEROLE = "chose-role",
  EMAILVERIFICATION = "email-verfication"

}

export enum Pages {
  USERS = "users",
  NEW = "new",
  TESTS = "tests",
  LOGIN = "login",
  ENRECHERSIGNUP = "enrichersignup",
  BENEFICIARYSIGNUP = "Beneficiarysignup",
  ADMIN = "admin",
  ORGANIZATION = "organization",
  EMPLOYEES = "employees",
  EMPLOYEE = "employee",
  ENRICHER = "enricher",
  CHILDREN = "children"
}

export enum AccountType {
  ORGANIZATION = "organization",
  ENRCHER = "enricher"
}

export enum InputTypes {
  TEXT = "text",
  EMAIL = "email",
  PASSWORD = "password",
  NUMBER = "number",
  DATE = "date",
  TIME = "time",
  DATE_TIME_LOCAL = "datetime-local",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SELECT = "select",
  TEXTAREA = "textarea",
  FILE = "file",
  IMAGE = "image",
  COLOR = "color",
  RANGE = "range",
  TEL = "tel",
  URL = "url",
  SEARCH = "search",
  MONTH = "month",
  WEEK = "week",
  HIDDEN = "hidden",
  MULTI_SELECT = "multi select",
  MARKDOWN = "markdown"
}

export enum StatusCode{
  BADREQUEST = 400,
  INTERNALSERVERERROR = 500,
  OK= 200,
  CONFLICT = 409,
  CREATED = 201,
  UNAUTHARIZED = 401,
}
export enum Navigate {
  NEXT = "next",
  PREV = "prev",
}
export enum Responses {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum SortBy {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  NAME = "name",
  EMAIL = "email",
  PHONE = "phone",
  STATUS = "status",
  START_DATE = "startDate",
  END_DATE = "endDate",
}

export enum AuthMessages {
  LOGIN_SUCCESS = "Login successfully",
  LOGOUT_SUCCESS = "Logout successfully",
  REGISTER_SUCCESS = "Register successfully",
  FORGET_PASSWORD_SUCCESS = "Forget password successfully",
  RESET_PASSWORD_SUCCESS = "Reset password successfully",
}

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum Environments {
  PROD = "production",
  DEV = "development",
}
export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANIZATIONOWNER = 'ORGANIZATIONOWNER',
  EMPLOYEE = 'EMPLOYEE',
  ENRICHER = 'ENRICHER',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

export enum FormTypes {
  ANS = "answer",
  QUESTIONS = "QUESTIONS",
  SIGNIN = "SIGNIN",
  EMPLOYEE = "EMPLOYEE",
  ENRICHER = "ENRICHER",
  TEST = "TESTS"
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
  MAILER = "mailer",
  VERIFYEMAIL = 'verfy-email',
  ROLES = "roles",
  ORGANIZATIONOWNER = "organization-owner",
  TESTS = "tests",
  ALL = "all",
  AUTH = "auth",
  ENRICHERSSIGNUP = "enrichers-signup",
  EMPLOYEES = "employees",
  EMPLOYEESBYORGNIZATION = `${EMPLOYEES}/organization`,
  USERS = "users",
  ORGANIZATIONS = "organizations",
  OWNER = "owner",
  CHILDREN = "children"
}