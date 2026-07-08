/**
 * Splits monolithic messages/{locale}.json into modular namespace files.
 * Run: node scripts/migrate-i18n.mjs
 */
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const LOCALES = ['en', 'ar']

const toCamelCase = (str) =>
  str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toLowerCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase())

const deepCamelKeys = (obj) => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [toCamelCase(k), deepCamelKeys(v)]))
}

const pick = (obj, ...paths) => {
  for (const p of paths) {
    const parts = p.split('.')
    let cur = obj
    for (const part of parts) {
      if (cur?.[part] === undefined) {
        cur = undefined
        break
      }
      cur = cur[part]
    }
    if (cur !== undefined) return cur
  }
  return undefined
}

const merge = (...objects) => Object.assign({}, ...objects.filter(Boolean))

function buildNamespaces(source) {
  const s = source
  const dash = deepCamelKeys(s.Dashboard ?? {})
  const features = deepCamelKeys(s.Features ?? {})
  const forms = deepCamelKeys(s.Forms ?? {})
  const signup = deepCamelKeys(s.Signup ?? {})
  const auth = deepCamelKeys(s.Auth ?? {})
  const header = deepCamelKeys(s.Header ?? {})
  const footer = deepCamelKeys(s.Footer ?? {})
  const homePage = deepCamelKeys(s.HomePage ?? {})
  const actionsRoot = deepCamelKeys(s.Actions ?? {})
  const backend = deepCamelKeys(s.Backend ?? {})
  const apiErrorsRoot = deepCamelKeys(s.ApiErrors ?? {})
  const errorsRoot = deepCamelKeys(s.errors ?? {})
  const errorPage = deepCamelKeys(s.error ?? {})
  const commonRoot = dash.common ?? {}

  const common = {
    states: {
      loading: pick(features, 'evaluations.loading') ?? 'Loading�',
      saving: commonRoot.saving ?? 'Saving...',
      adding: commonRoot.adding ?? 'Adding...',
      deleting: commonRoot.deleting ?? 'Deleting...',
      sending: pick(features, 'notifications.sending') ?? 'Sending...',
      submitting: pick(auth, 'login.submitting') ?? 'Submitting...',
      redirecting: auth.redirecting ?? 'Redirecting...',
      checking: auth.checking ?? 'Checking session...',
    },
    empty: {
      noData: commonRoot.noData ?? 'No data',
    },
    yesNo: {
      yes: commonRoot.yes ?? 'Yes',
      no: commonRoot.no ?? 'No',
    },
    general: {
      home: commonRoot.home ?? 'Home',
      open: commonRoot.open ?? 'Open',
      unauthorized: commonRoot.unauthorized ?? 'Unauthorized',
      search: deepCamelKeys(s.Common ?? {}).search ?? 'Search...',
      close: deepCamelKeys(s.Common ?? {}).close ?? 'Close',
      confirmDelete: commonRoot.confirmDelete ?? 'Are you sure?',
      edit: commonRoot.edit ?? 'Edit',
      done: pick(s.CreateChild, 'Done') ?? 'Done',
      retry: pick(features, 'evaluations.retry') ?? 'Retry',
    },
  }

  const actions = merge(
    {
      create: commonRoot.add ?? 'Add',
      update: commonRoot.saveChanges ?? 'Save changes',
      save: commonRoot.saveChanges ?? 'Save changes',
      delete: commonRoot.delete ?? 'Delete',
      cancel: commonRoot.cancel ?? 'Cancel',
      add: commonRoot.add ?? 'Add',
      approve: pick(features, 'organizations.admin.approve') ?? 'Approve',
      reject: pick(features, 'organizations.admin.reject') ?? 'Reject',
      publish: pick(features, 'deals.publishDeal') ?? 'Publish',
      submit: pick(signup, 'beneficiary.wizard.submit') ?? 'Submit',
      confirm: pick(features, 'deals.confirmWin') ?? 'Confirm',
      archive: 'Archive',
      restore: 'Restore',
      assign: 'Assign',
    },
    actionsRoot,
    {
      deals: deepCamelKeys(s.Deals ?? {}),
      payments: deepCamelKeys(s.Payments ?? {}),
      transfers: deepCamelKeys(s.Transfers ?? {}),
    },
  )

  const navigation = {
    header: {
      menu: header.menu ?? {},
      search: header.search ?? 'Search',
      login: header.login ?? 'Login',
    },
    footer: {
      menu: footer.about ?? {},
    },
    dashboard: dash.nav ?? {},
    organization: deepCamelKeys(s.Layout ?? {}).organizationNav ?? {},
  }

  const metadata = merge(deepCamelKeys(s.Metadata ?? {}), {
    pages: {
      home: homePage.metaData ?? { title: homePage.title ?? '' },
      about: { title: pick(s.About, 'title') ?? '' },
      privacy: { title: pick(s.Privacy, 'headerTitle') ?? '' },
      dashboard: { title: dash.titles?.dashboard ?? 'Dashboard' },
    },
    openGraph: {
      title: deepCamelKeys(s.Metadata ?? {}).title ?? '',
      description: deepCamelKeys(s.Metadata ?? {}).description ?? '',
    },
    twitter: {
      title: deepCamelKeys(s.Metadata ?? {}).title ?? '',
      description: deepCamelKeys(s.Metadata ?? {}).description ?? '',
    },
  })

  const validation = merge(
    {
      required: errorsRoot.name_required ?? errorPage.name_required ?? 'This field is required',
      email: errorsRoot.invalid_email ?? errorPage.invalid_email ?? 'Invalid email',
      phone: errorsRoot.phone_required ?? 'Phone number is required',
      invalidDate: errorsRoot.birthDate_invalid ?? errorPage.birthDate_invalid ?? 'Invalid date',
      minLength: pick(signup, 'beneficiary.validation.name.min') ?? 'Too short',
      maxLength: pick(signup, 'beneficiary.validation.name.max') ?? 'Too long',
      passwordTooWeak:
        pick(signup, 'beneficiary.validation.password.pattern') ?? 'Password too weak',
      passwordMin: errorsRoot.password_min ?? pick(signup, 'beneficiary.validation.password.min'),
      numbersOnly: 'Numbers only',
      invalidUrl: 'Invalid URL',
      birthDateRequired: errorsRoot.birthDate_required ?? 'Birth date is required',
      birthDateMax: errorsRoot.birthDate_max ?? "This is not a child's age",
      birthDateFuture: errorsRoot.birthDate_future ?? 'Birth date cannot be in the future',
      nameRequired: errorsRoot.name_required ?? 'Name is required',
    },
    signup.beneficiary?.validation ?? {},
    {
      organizationRejectReason: features.organizations?.admin?.rejectValidation ?? {},
      createChild: deepCamelKeys(s.CreateChild ?? {}).validation ?? {},
    },
  )

  const errors = {
    network: 'Network error. Please check your connection.',
    unexpected: errorPage.description ?? 'An unexpected error occurred. Please try again.',
    permissionDenied:
      apiErrorsRoot.noPermission ?? 'You do not have permission to perform this action.',
    offline: 'You appear to be offline.',
    pageNotFound: deepCamelKeys(s.notFound ?? {}),
    serverUnavailable: 'Server is temporarily unavailable.',
    sessionExpired: auth.sessionExpired ?? apiErrorsRoot.sessionExpired,
    global: deepCamelKeys(s.GlobalError ?? {}),
    auth: deepCamelKeys(s.AuthError ?? {}),
    dashboard: deepCamelKeys(s.DashboardError ?? {}),
    errorCard: deepCamelKeys(s.ErrorCard ?? {}),
    page: {
      title: errorPage.title ?? 'Something went wrong',
      description: errorPage.description ?? 'An unexpected error occurred. Please try again.',
    },
    unauthorized: deepCamelKeys(s.Unauthorized ?? {}),
    flowNotAvailable: deepCamelKeys(s.TestsPage ?? {}),
    legacyFlow: deepCamelKeys(s.Flow6 ?? {}),
  }

  const apiErrors = merge(backend, apiErrorsRoot)

  const authNs = {
    ...auth,
    login: auth.login ?? {},
  }

  const signupNs = signup

  const dashboard = {
    titles: dash.titles ?? {},
    cards: dash.cards ?? {},
    tables: dash.tables ?? {},
    parent: merge(dash.parent ?? {}, features.parentDashboard ?? {}),
    choseRole: deepCamelKeys(s.ChoseRole ?? {}),
    adminUsers: deepCamelKeys(s.AdminUsers ?? {}),
  }

  const children = {
    title: dash.children?.title ?? 'Children',
    description: dash.children?.subtitle ?? '',
    page: { title: dash.children?.title ?? 'Children' },
    actions: dash.children?.actions ?? {},
    fields: merge(
      dash.children?.fields ?? {},
      dash.children?.gender ? { genderOptions: dash.children.gender } : {},
    ),
    filters: {
      grade: dash.children?.gradeFilter,
      allGrades: dash.children?.allGrades,
      class: dash.children?.classFilter,
      allClasses: dash.children?.allClasses,
      searchPlaceholder: dash.children?.searchPlaceholder,
    },
    dialogs: dash.children?.dialog ?? {},
    table: dash.children?.table ?? {},
    status: { evaluation: dash.children?.evaluationStatus ?? {} },
    messages: {},
    validation: {},
    breadcrumbs: {},
    statistics: {},
    emptyStates: {},
    goToEdit: dash.children?.goToEdit,
    transferRequests: dash.childTransferRequests ?? {},
    approveTransfer: dash.approveChildTransfer ?? {},
    create: deepCamelKeys(s.CreateChild ?? {}),
    forms: forms.child ?? {},
  }

  const teachers = {
    title: dash.teachers?.title ?? 'Teachers',
    description: dash.teachers?.subtitle ?? '',
    page: { title: dash.teachers?.title ?? 'Teachers' },
    actions: { add: dash.teachers?.add ?? 'Add teacher' },
    fields: dash.teachers?.fields ?? {},
    filters: {},
    dialogs: {},
    table: {},
    status: {},
    messages: { empty: dash.teachers?.empty ?? 'No teachers yet' },
    validation: {},
    breadcrumbs: {},
    statistics: {},
    emptyStates: { list: dash.teachers?.empty ?? 'No teachers yet' },
    dashboard: features.teacherDashboard ?? {},
    forms: forms.teacher ?? {},
  }

  const organizations = {
    title: features.organizations?.admin?.title ?? 'Organizations',
    description: features.organizations?.admin?.subtitle ?? '',
    page: {},
    actions: {},
    fields: {},
    filters: {},
    dialogs: {
      approve: features.organizations?.admin?.approveDialog ?? {},
      reject: features.organizations?.admin?.rejectDialog ?? {},
    },
    table: { columns: features.organizations?.admin?.columns ?? {} },
    status: features.organizations?.status ?? {},
    messages: {
      pending: features.organizations?.pending ?? {},
      rejected: features.organizations?.rejected ?? {},
      approvalRequired: features.organizations?.approvalRequired,
      empty: features.organizations?.admin?.empty ?? {},
      errors: features.organizations?.admin?.errors ?? {},
    },
    validation: { rejectReason: features.organizations?.admin?.rejectValidation ?? {} },
    breadcrumbs: {},
    statistics: {},
    emptyStates: features.organizations?.admin?.empty ?? {},
    types: features.organizations?.types ?? {},
    admin: features.organizations?.admin ?? {},
    dashboard: deepCamelKeys(s.OrgDashboard ?? {}),
    results: deepCamelKeys(s.OrgResults ?? {}),
    organizationEvaluations: features.organizationEvaluations ?? {},
    grades: {
      title: dash.grades?.title,
      description: dash.grades?.subtitle,
      actions: { add: dash.grades?.add },
      fields: dash.grades?.fields ?? {},
      filters: { searchPlaceholder: dash.grades?.searchPlaceholder },
      dialogs: { editTitle: dash.grades?.editTitle, deleteTitle: dash.grades?.deleteTitle },
      forms: forms.grade ?? {},
    },
    classes: {
      title: dash.classes?.title,
      description: dash.classes?.subtitle,
      actions: { add: dash.classes?.add },
      fields: dash.classes?.fields ?? {},
      filters: {
        searchPlaceholder: dash.classes?.searchPlaceholder,
        grade: dash.classes?.gradeFilter,
        allGrades: dash.classes?.allGrades,
      },
      dialogs: { editTitle: dash.classes?.editTitle, deleteTitle: dash.classes?.deleteTitle },
      forms: forms.class ?? {},
    },
    gradeDetail: dash.gradeDetail ?? {},
    classDetail: merge(dash.classDetail ?? {}, { children: dash.children?.fields ?? {} }),
  }

  const employees = {
    title: 'Employees',
    description: '',
    page: { details: dash.employees?.titles?.details ?? 'Employee Details' },
    actions: {},
    fields: dash.employees?.fields ?? {},
    filters: {},
    dialogs: {
      addTitle: forms.employee?.dialogTitle,
      addDescription: forms.employee?.dialogDescription,
      editTitle: forms.employee?.editTitle,
      editDescription: forms.employee?.editDescription,
      deleteTitle: forms.employee?.deleteTitle,
      deleteDescription: forms.employee?.deleteDescription,
    },
    table: dash.employees?.table ?? {},
    status: {},
    messages: { loadFailed: dash.employees?.errors?.loadFailed },
    validation: {},
    breadcrumbs: {},
    statistics: {},
    emptyStates: {},
    forms: forms.employee ?? {},
  }

  const users = {
    title: 'Users',
    description: '',
    page: {},
    actions: {},
    fields: merge(features.users ?? {}, features.Users ?? {}),
    filters: {},
    dialogs: {},
    table: {},
    status: {},
    messages: {},
    validation: {},
    breadcrumbs: {},
    statistics: {},
    emptyStates: {},
    admin: dashboard.adminUsers ?? {},
    rolesChart: deepCamelKeys(s.UsersRolesChart ?? {}),
  }

  const evaluations = {
    title: features.evaluations?.listTitle ?? 'Evaluations',
    description: features.evaluations?.detailsTitle ?? '',
    page: {},
    actions: {},
    fields: {},
    filters: {},
    dialogs: {},
    table: {},
    status: {
      attempt: features.evaluations?.attemptStatus ?? {},
      types: features.evaluations?.types ?? {},
    },
    messages: {},
    validation: {},
    breadcrumbs: {},
    statistics: {},
    emptyStates: { list: features.evaluations?.empty ?? 'No data' },
    ...features.evaluations,
    results: features.evaluationResults ?? {},
    organization: features.organizationEvaluations ?? {},
    orgResults: deepCamelKeys(s.OrgResults ?? {}),
    builder: deepCamelKeys(s.EvaluationBuilder ?? {}),
    start: deepCamelKeys(s.StartEvaluation ?? {}),
    submitModal: deepCamelKeys(s.SubmitModal ?? {}),
    session: deepCamelKeys(s.EvaluationSession ?? {}),
    capacityRequests: deepCamelKeys(s.CapacityRequests ?? {}),
    tests: features.tests ?? {},
    testsPage: deepCamelKeys(s.TestsPage ?? {}),
    testForms: forms.test ?? {},
  }

  const deals = {
    title: features.deals?.deals ?? 'Deals',
    description: features.deals?.dealsSubtitle ?? '',
    page: {},
    actions: {},
    fields: {},
    filters: {},
    dialogs: {
      confirmSelection: {
        title: features.deals?.confirmSelection,
        description: features.deals?.confirmSelectionDesc,
      },
      confirmApproval: {
        title: features.deals?.confirmApproval,
        description: features.deals?.confirmApprovalDesc,
      },
    },
    table: {},
    status: {},
    messages: {},
    validation: { pastDeadline: features.deals?.pastDeadlineError },
    breadcrumbs: {},
    statistics: {},
    emptyStates: { list: features.deals?.noDeals ?? 'No deals yet' },
    ...features.deals,
    enricher: features.enricherDashboard ?? {},
  }

  const notifications = {
    title: features.notifications?.title ?? 'Notifications',
    description: features.notifications?.subtitle ?? '',
    page: {},
    actions: {},
    fields: {},
    filters: {
      all: features.notifications?.filterAll,
      unread: features.notifications?.filterUnread,
    },
    dialogs: {},
    table: {},
    status: {},
    messages: {},
    validation: {},
    breadcrumbs: {},
    statistics: {},
    emptyStates: { list: features.notifications?.empty ?? 'No notifications' },
    ...features.notifications,
  }

  const activities = {
    title: features.activities?.title ?? 'Activities',
    description: '',
    page: {},
    actions: { create: features.activities?.create ?? 'Add activity' },
    fields: {
      name: features.activities?.name,
      namePlaceholder: features.activities?.namePlaceholder,
      dealsCount: features.activities?.dealsCount,
    },
    filters: {},
    dialogs: {
      createTitle: features.activities?.createTitle,
      editTitle: features.activities?.editTitle,
      deleteTitle: features.activities?.deleteTitle,
      deleteConfirm: features.activities?.deleteConfirm,
    },
    table: { actions: features.activities?.actions },
    status: {},
    messages: { empty: features.activities?.empty },
    validation: {},
    breadcrumbs: {},
    statistics: {},
    emptyStates: { list: features.activities?.empty ?? 'No activities yet' },
  }

  const landing = {
    title: homePage.title ?? '',
    hero: homePage.hero ?? {},
    beneficiaries: homePage.beneficiaries ?? {},
    features: homePage.features ?? {},
    howItWorks: homePage.howItWorks ?? {},
    testimonials: homePage.testimonials ?? {},
    footer: footer ?? {},
    flowCta: deepCamelKeys(s.Flow6 ?? {}),
  }

  const about = deepCamelKeys(s.About ?? {})
  const privacy = deepCamelKeys(s.Privacy ?? {})
  const terms = {
    title: footer.legal?.terms ?? footer.Legal?.Terms ?? 'Terms & Conditions',
    description: '',
    page: {},
  }

  const verifyEmail = merge(
    deepCamelKeys(s.VerifyEmail ?? {}),
    deepCamelKeys(s.EmailVerification ?? {}),
  )

  const dialogs = {
    confirmDelete: {
      title: commonRoot.confirmDelete ?? 'Are you sure?',
      description:
        pick(dash, 'children.dialog.deleteDescription') ?? 'This action cannot be undone.',
    },
    delete: {
      title: commonRoot.delete ?? 'Delete',
      cancel: commonRoot.cancel ?? 'Cancel',
    },
  }

  const formsNs = {
    login: forms.login ?? {},
    shared: {
      name: { label: 'Name', placeholder: 'Enter name' },
      email: { label: 'Email', placeholder: 'Enter email' },
      phone: { label: 'Phone', placeholder: 'Enter phone' },
      password: { label: 'Password', placeholder: 'Enter password' },
    },
  }

  const tables = {
    search: common.general.search ?? 'Search...',
    rowsPerPage: 'Rows per page',
    empty: common.empty.noData ?? 'No data',
    sort: 'Sort',
    filters: 'Filters',
    loading: common.states.loading ?? 'Loading�',
    actions: 'Actions',
  }

  const pagination = merge(dash.pagination ?? {}, {
    previous: features.notifications?.prev ?? dash.pagination?.previous ?? 'Previous',
    next: features.notifications?.next ?? dash.pagination?.next ?? 'Next',
    page: dash.pagination?.page ?? 'Page',
    items: dash.pagination?.items ?? 'items',
    pageOf: features.notifications?.pageOf ?? 'Page {page} of {total}',
  })

  const emails = {
    verification: {
      title: verifyEmail.title ?? 'Email verification',
      sentLink: verifyEmail.sentLink ?? 'We sent a verification link to',
      instruction:
        verifyEmail.instruction ?? 'Open the email and click the link to verify your account.',
      resend: verifyEmail.resend ?? 'Resend Email',
      resendIn: verifyEmail.resendIn ?? 'Resend in {cooldown}s',
      sendSuccess: verifyEmail.sendSuccess ?? 'Email sent successfully',
      sendFailed: verifyEmail.sendFailed ?? 'Failed to send email',
    },
    resetPassword: {
      title: 'Reset password',
      instruction: 'Click the link in your email to reset your password.',
    },
    invitation: {
      title: 'Invitation',
      instruction: 'You have been invited to join {organizationName}.',
    },
    welcome: {
      title: 'Welcome',
      instruction: 'Welcome to Ithraa Intelligence.',
    },
  }

  return {
    common,
    actions,
    navigation,
    metadata,
    validation,
    errors,
    'api-errors': apiErrors,
    auth: authNs,
    signup: signupNs,
    dashboard,
    children,
    teachers,
    organizations,
    employees,
    users,
    evaluations,
    deals,
    notifications,
    activities,
    landing,
    about,
    privacy,
    terms,
    'verify-email': verifyEmail,
    dialogs,
    forms: formsNs,
    tables,
    pagination,
    emails,
  }
}

/** Maps old useTranslations namespace to new namespace */
export const namespaceMap = {
  'Dashboard.common': 'common',
  Common: 'common',
  'Dashboard.pagination': 'pagination',
  'Dashboard.Nav': 'navigation.dashboard',
  'Layout.OrganizationNav': 'navigation.organization',
  Header: 'navigation.header',
  Footer: 'landing.footer',
  Metadata: 'metadata',
  HomePage: 'landing',
  'HomePage.Hero': 'landing.hero',
  'HomePage.Beneficiaries': 'landing.beneficiaries',
  'HomePage.HowItWorks': 'landing.howItWorks',
  'HomePage.Testimonials': 'landing.testimonials',
  'HomePage.MetaData': 'metadata.pages.home',
  About: 'about',
  Privacy: 'privacy',
  Auth: 'auth',
  'Auth.Login': 'auth.login',
  Signup: 'signup',
  'Signup.Beneficiary': 'signup.beneficiary',
  'Signup.Beneficiary.TypeStep': 'signup.beneficiary.typeStep',
  'Signup.Beneficiary.Organization': 'signup.beneficiary.organization',
  'Signup.Beneficiary.Parent': 'signup.beneficiary.parent',
  'Signup.Beneficiary.Teacher': 'signup.beneficiary.teacher',
  'Signup.Beneficiary.Enricher': 'signup.beneficiary.enricher',
  'Signup.Beneficiary.Wizard': 'signup.beneficiary.wizard',
  'Signup.Beneficiary.Validation': 'validation',
  VerifyEmail: 'verifyEmail',
  EmailVerification: 'verifyEmail',
  'Dashboard.Children': 'children',
  'Dashboard.ChildTransferRequests': 'children.transferRequests',
  'Dashboard.ApproveChildTransfer': 'children.approveTransfer',
  CreateChild: 'children.create',
  'Forms.Child': 'children.forms',
  'Dashboard.Teachers': 'teachers',
  'Features.TeacherDashboard': 'teachers.dashboard',
  'Forms.Teacher': 'teachers.forms',
  'Dashboard.Grades': 'organizations.grades',
  'Dashboard.Classes': 'organizations.classes',
  'Dashboard.GradeDetail': 'organizations.gradeDetail',
  'Dashboard.ClassDetail': 'organizations.classDetail',
  'Forms.Grade': 'organizations.grades.forms',
  'Forms.Class': 'organizations.classes.forms',
  'Dashboard.Employees': 'employees',
  'Forms.Employee': 'employees.forms',
  'Features.users': 'users',
  'Features.Users': 'users',
  AdminUsers: 'dashboard.adminUsers',
  UsersRolesChart: 'users.rolesChart',
  'Features.Evaluations': 'evaluations',
  'Features.EvaluationResults': 'evaluations.results',
  'Features.EvaluationResults.multipleIntelligences': 'evaluations.results.multipleIntelligences',
  'Features.EvaluationResults.pride': 'evaluations.results.pride',
  'Features.EvaluationResults.renzulli': 'evaluations.results.renzulli',
  'Features.EvaluationResults.holland': 'evaluations.results.holland',
  'Features.EvaluationResults.learningStyles': 'evaluations.results.learningStyles',
  'Features.OrganizationEvaluations': 'evaluations.organization',
  OrgResults: 'evaluations.orgResults',
  EvaluationBuilder: 'evaluations.builder',
  StartEvaluation: 'evaluations.start',
  SubmitModal: 'evaluations.submitModal',
  EvaluationSession: 'evaluations.session',
  CapacityRequests: 'evaluations.capacityRequests',
  'Features.Tests': 'evaluations.tests',
  TestsPage: 'evaluations.testsPage',
  'Forms.Test': 'evaluations.testForms',
  'Forms.Test.wizard': 'evaluations.testForms.wizard',
  'Features.Organizations': 'organizations',
  'Features.Organizations.admin': 'organizations.admin',
  'Features.Organizations.admin.rejectValidation': 'organizations.validation.rejectReason',
  'Features.Organizations.status': 'organizations.status',
  OrgDashboard: 'organizations.dashboard',
  'Features.Deals': 'deals',
  'Features.EnricherDashboard': 'deals.enricher',
  Deals: 'actions.deals',
  Payments: 'actions.payments',
  Transfers: 'actions.transfers',
  'Features.Notifications': 'notifications',
  'Features.Activities': 'activities',
  'Features.ParentDashboard': 'dashboard.parent',
  'Dashboard.Parent': 'dashboard.parent',
  'Dashboard.Parent.privateChildren': 'dashboard.parent.privateChildren',
  'Dashboard.Parent.orgChildren': 'dashboard.parent.orgChildren',
  Actions: 'actions',
  Forms: 'forms',
  'Forms.Login': 'forms.login',
  Backend: 'apiErrors',
  ApiErrors: 'apiErrors',
  errors: 'validation',
  error: 'errors.page',
  notFound: 'errors.pageNotFound',
  GlobalError: 'errors.global',
  AuthError: 'errors.auth',
  DashboardError: 'errors.dashboard',
  ErrorCard: 'errors.errorCard',
  Unauthorized: 'errors.unauthorized',
  Flow6: 'landing.flowCta',
  ChoseRole: 'dashboard.choseRole',
}

/** Maps old full translation keys (with old namespace) to new full keys */
export const keyPathMap = {
  'Dashboard.common.cancel': 'actions.cancel',
  'Dashboard.common.add': 'actions.add',
  'Dashboard.common.adding': 'common.states.adding',
  'Dashboard.common.saveChanges': 'actions.save',
  'Dashboard.common.saving': 'common.states.saving',
  'Dashboard.common.delete': 'actions.delete',
  'Dashboard.common.deleting': 'common.states.deleting',
  'Dashboard.common.unauthorized': 'common.general.unauthorized',
  'Dashboard.common.home': 'common.general.home',
  'Dashboard.common.edit': 'common.general.edit',
  'Dashboard.common.noData': 'common.empty.noData',
  'Dashboard.common.confirmDelete': 'common.general.confirmDelete',
  'Dashboard.common.yes': 'common.yesNo.yes',
  'Dashboard.common.no': 'common.yesNo.no',
  'Dashboard.common.open': 'common.general.open',
  'Dashboard.cards.trendingUp': 'dashboard.cards.trendingUp',
  'Dashboard.cards.last6Months': 'dashboard.cards.last6Months',
  'Dashboard.cards.employeesCount': 'dashboard.cards.employeesCount',
  'Dashboard.cards.childrenCount': 'dashboard.cards.childrenCount',
  'Actions.common.deleted': 'actions.common.deleted',
  'Features.Tests.Actions.Add': 'evaluations.tests.actions.add',
  'Features.Tests.actions.add': 'evaluations.tests.actions.add',
}

for (const locale of LOCALES) {
  const inputPath = path.join(ROOT, 'messages', `${locale}.json`)
  const source = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  const namespaces = buildNamespaces(source)

  for (const [fileName, content] of Object.entries(namespaces)) {
    const dir = path.join(ROOT, 'messages', locale)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, `${fileName}.json`),
      `${JSON.stringify(content, null, 2)}\n`,
      'utf8',
    )
  }
  console.log(`? Generated ${Object.keys(namespaces).length} namespaces for ${locale}`)
}

fs.writeFileSync(
  path.join(ROOT, 'scripts', 'i18n-namespace-map.json'),
  JSON.stringify({ namespaceMap, keyPathMap }, null, 2),
)
console.log('? Wrote scripts/i18n-namespace-map.json')
