# AI Frontend Context

This is the AI-readable architecture map for the Ithraa frontend. It was reverse engineered from the repository at `d:\projects\ithraa\frontend`, not inferred from product naming alone. Treat this file as the first stop for future frontend changes, but still inspect touched files before editing.

## 1. Frontend Overview

The frontend is a multilingual educational evaluation platform built with Next.js App Router. It serves public marketing pages, authentication and signup, role-based dashboards, organization management, parent child/evaluation flows, teacher class views, admin evaluation/test/attempt screens, and notifications.

Core stack:

```txt
Next.js 16 App Router
React 19
TypeScript strict mode
next-intl locale routing
next-auth credentials provider with JWT sessions
TanStack React Query
TanStack React Table
React Hook Form + Zod
Tailwind CSS v4 + shadcn/ui + Radix
Sonner toasts
Recharts, Swiper, dnd-kit dependencies
```

The app is locale-first. Most application routes live under `src/app/[locale]`. Locales are defined in `src/i18n/routing.ts` as `en` and `ar`, with `ar` as the default locale. `src/app/[locale]/layout.tsx` validates the locale, sets `html lang` and `dir`, loads the Cairo font, installs `NextIntlClientProvider`, `Providers` from `src/components/providers/QueryClientProvider.tsx`, and a global shadcn/Sonner `Toaster`.

Main user journeys:

- Public visitor lands on `/{locale}` through `src/app/[locale]/(main)/page.tsx`, wrapped by `src/app/[locale]/(main)/layout.tsx` with public `Header` and `Footer`, and sees home sections from `src/components/pages/home/*`.
- User logs in at `/{locale}/auth/login` via `src/app/[locale]/auth/login/page.tsx` and `src/components/pages/login/LoginForm.tsx`. Login delegates to NextAuth through `useAuth().login()`.
- After login, `src/proxy.ts`, `src/features/auth/utils/redirects.ts`, and `useAuth().getRedirectAfterLogin()` route users by email verification and role.
- Admin users work under `/dashboards/admin`: dashboard, users, organizations, children, tests, evaluations, attempts, notification dispatch.
- Organization owners work under `/dashboards/organization`: dashboard, grades, classes, children, teachers, employees, results, attempt/result views.
- Parents work under `/dashboards/parent`: dashboard, children, child-specific evaluations, evaluation start and attempt/result views.
- Teachers work under `/dashboards/teacher`: dashboard and assigned classes.
- Notifications are exposed through `/dashboards/notifications` and notification bell components.

Rendering strategy:

- Route files are mostly thin App Router adapters. Many are server components that fetch initial data with `api.server`/feature API helpers and then render page-level client screens.
- Client components own search/filter state, dialogs, pagination, table state, React Query calls, and interactive forms.
- Server actions handle much of the organization CRUD surface: children, grades, classes, employees, teachers, tests.
- React Query handles client-owned server state for evaluations, attempts, notifications, users/organizations lookups, and some domain lists.
- Some dynamic pages are fully client-rendered route pages that read route params with `next/navigation` and fetch via React Query, for example `src/app/[locale]/dashboards/parent/attempts/[attemptId]/page.tsx`.

High-level flow:

```txt
Request
  -> src/proxy.ts
      -> next-intl middleware
      -> NextAuth JWT read via getToken()
      -> auth, email verification, and dashboard role redirects
  -> src/app/[locale]/layout.tsx
      -> lang/dir + font + messages + QueryClient + SessionProvider + Toaster
  -> role layout
      -> RequireRoles server gate for admin/organization/parent/teacher
      -> dashboard sidebar or organization header shell
  -> page.tsx
      -> server fetch or client route shell
  -> screen/component
      -> local UI state, server actions, React Query mutations
```

## 2. Project Structure

Top-level organization:

```txt
src/app
  [locale]                     Locale-scoped App Router pages/layouts
  api/auth                     NextAuth, refresh proxy, verify-email route handlers

src/components
  ui                           shadcn/Radix primitives
  shared                       reusable app patterns: forms, tables, dashboard cards, management UI
  pages                        page-level screens grouped by product area
  layouts                      public and organization-specific layout pieces
  evaluation                   evaluation runner, builder, questions, result views
  notifications                bell, list, item, notification utilities

src/features
  auth                         auth API, hooks, guards, RBAC, signup flow
  forms                        Zod schemas, form registry, RHF/server-action form framework
  evaluations                  API, React Query hooks, types, columns, payload helpers
  notifications                API, query hooks, types
  children/classes/grades      organization CRUD domains
  employees/teachers           staff CRUD and teacher dashboard domain
  users/organizations/tests    admin and domain APIs
  parent/admin                 role shell components

src/lib
  api                          server/client fetch wrappers and pagination helpers
  auth                         token expiry helpers
  errors                       ApiError
  helpers                      current organization/teacher helpers
  i18n                         small locale utilities
  toast                        Sonner toast wrappers
  types                        enums and broad shared interfaces
```

Feature folders commonly use this shape:

```txt
src/features/<domain>/
  api/index.ts
  actions/*.action.ts
  hooks/index.ts
  components/*.tsx
  types/*.ts
  index.ts
```

Why the structure works:

- Route files stay thin when following the intended pattern. Example: `src/app/[locale]/dashboards/organization/children/page.tsx` gets the organization, fetches children/grades/classes in `Promise.all`, and passes them to `ChildrenScreen`.
- Backend communication is mostly centralized through feature `api/index.ts` files.
- Server actions are colocated with domain ownership, for example `src/features/classes/actions/create-class.action.ts`.
- Generated/base UI lives under `src/components/ui`, while app-specific reusable patterns live under `src/components/shared`.

Where it breaks:

- Page-level feature UI is split between `src/components/pages/dashboards/...` and `src/features/<domain>/components`. Example: admin evaluation screens live under `src/components/pages/dashboards/admin`, while evaluation columns/hooks/API live under `src/features/evaluations`.
- Some shared components are not truly domain-free. `src/components/shared/management/EntityCard.tsx` is generic in props but visually/behaviorally tied to card CRUD. Older or commented Arabic/mojibake code remains in that file.
- Navigation imports are mixed. Locale-aware `@/i18n/navigation` is common, but several localized route components still import `next/link` or `next/navigation`.
- Broad shared types are scattered across `src/lib/types/types.ts`, `src/lib/types/types/interfaces.ts`, `src/lib/types/interfaces.ts`, and feature-level types.
- Several route/enum names contain typos that are now route contracts: `unautharized`, `email-verfication`, `chose-role`, `Endpoint.VERIFYEMAIL = "verfy-email"`, `StatusCode.UNAUTHARIZED`.

Scalability concerns:

- The project is feature-oriented but not fully feature-owned. For new work, keep backend calls/actions/types in `src/features/<domain>` and keep route files as composition only.
- Avoid adding more broad shared types unless a type is genuinely cross-domain. Prefer feature-owned interfaces and export through `src/features/<domain>/index.ts`.
- Avoid adding feature imports to `src/components/ui`. That folder should stay primitive-only.

## 3. Routing & Navigation

Route inventory from `src/app/[locale]`:

```txt
/{locale}
  (main)/page.tsx
  auth/login/page.tsx
  auth/Beneficiarysignup/page.tsx
  chose-role/page.tsx
  email-verfication/page.tsx
  verify-email/page.tsx
  unauthorized/page.tsx
  notifications/page.tsx
  tests/page.tsx
  flow-6/page.tsx

  dashboards/admin/page.tsx
  dashboards/admin/users/page.tsx
  dashboards/admin/organizations/page.tsx
  dashboards/admin/children/page.tsx
  dashboards/admin/tests/page.tsx
  dashboards/admin/tests/new/page.tsx
  dashboards/admin/evaluations/page.tsx
  dashboards/admin/evaluations/create/page.tsx
  dashboards/admin/evaluations/[evaluationId]/page.tsx
  dashboards/admin/attempts/page.tsx
  dashboards/admin/attempts/[attemptId]/page.tsx
  dashboards/admin/notifications/dispatch/page.tsx

  dashboards/organization/page.tsx
  dashboards/organization/grades/page.tsx
  dashboards/organization/grades/new/page.tsx
  dashboards/organization/grades/[gradeId]/page.tsx
  dashboards/organization/grades/[gradeId]/edit/page.tsx
  dashboards/organization/classes/page.tsx
  dashboards/organization/classes/new/page.tsx
  dashboards/organization/classes/[classId]/page.tsx
  dashboards/organization/classes/[classId]/edit/page.tsx
  dashboards/organization/children/page.tsx
  dashboards/organization/children/new/page.tsx
  dashboards/organization/children/[childId]/page.tsx
  dashboards/organization/teachers/page.tsx
  dashboards/organization/teachers/new/page.tsx
  dashboards/organization/employees/page.tsx
  dashboards/organization/employees/[employeeId]/page.tsx
  dashboards/organization/results/page.tsx
  dashboards/organization/attempts/[attemptId]/page.tsx

  dashboards/parent/page.tsx
  dashboards/parent/children/page.tsx
  dashboards/parent/children/[childId]/evaluations/page.tsx
  dashboards/parent/evaluations/page.tsx
  dashboards/parent/evaluations/[evaluationId]/page.tsx
  dashboards/parent/evaluations/[evaluationId]/start/page.tsx
  dashboards/parent/attempts/[attemptId]/page.tsx

  dashboards/teacher/page.tsx
  dashboards/teacher/classes/page.tsx
  dashboards/notifications/page.tsx
```

Layout hierarchy:

```txt
src/app/[locale]/layout.tsx
  - validates locale
  - sets html lang/dir
  - loads Cairo font
  - installs NextIntlClientProvider, Providers, Toaster

src/app/[locale]/(main)/layout.tsx
  - public header/footer shell

src/app/[locale]/dashboards/layout.tsx
  - thin passthrough wrapper

src/app/[locale]/dashboards/admin/layout.tsx
  - RequireRoles ADMIN
  - SidebarProvider + AdminSidebar + SidebarInset

src/app/[locale]/dashboards/organization/layout.tsx
  - gets server session
  - getCurrentOrganization()
  - RequireRoles ORGANIZATIONOWNER or ADMIN
  - OrganizationHeader + content padding + Footer

src/app/[locale]/dashboards/parent/layout.tsx
  - RequireRoles PARENT
  - SidebarProvider + ParentSidebar + DashboardTopBar + SidebarInset

src/app/[locale]/dashboards/teacher/layout.tsx
  - RequireRoles TEACHER or ADMIN
  - SidebarProvider + TeacherSidebar + DashboardTopBar + SidebarInset
```

`src/proxy.ts` is the central route gate. It:

- Runs `next-intl` middleware using `routing`.
- Extracts and strips the locale from the pathname for route checks.
- Reads the NextAuth token via `getToken`.
- Redirects unauthenticated users away from protected dashboard routes and `chose-role`.
- Redirects authenticated users away from `/auth`.
- Forces unverified authenticated users on protected routes to `/{locale}/email-verfication`.
- Allows `/verify-email` to pass through.
- Enforces dashboard section access through `ACCESS_MAP`.

Current role home map in `src/proxy.ts`:

```txt
ADMIN             -> /{locale}/dashboards/admin
ORGANIZATIONOWNER -> /{locale}/dashboards/organization
TEACHER           -> /{locale}/dashboards/teacher
PARENT            -> /{locale}/dashboards/parent
multiple roles    -> /{locale}/chose-role
fallback          -> /{locale}/dashboards/parent
```

Authorization is layered:

- `src/proxy.ts`: coarse edge-style gating and redirect decisions.
- `src/features/auth/components/RequireRoles.tsx`: server component used in protected layouts.
- `src/features/auth/components/ProtectedRoute.tsx`: client guard available but not the primary layout gate.
- `src/features/auth/hooks/useRBAC.ts` and `useAuth().checkRole`: client UI checks only.

Navigation:

- Locale-aware wrappers are exported from `src/i18n/navigation.ts`.
- Prefer `Link`, `useRouter`, `usePathname`, and `redirect` from `@/i18n/navigation`.
- Some components still use `next/link`: `ChildrenScreen`, `ClassesScreenClient`, `ManagementPageHeader`, `EmptyState`, several form/detail screens. These can produce non-locale-aware paths if given absolute paths.
- `src/app/[locale]/notifications/page.tsx` and `src/app/[locale]/dashboards/parent/evaluations/page.tsx` are redirect aliases using `@/i18n/navigation`.
- Breadcrumbs are ad hoc arrays passed into `ManagementPageHeader`, not route-derived.

Dynamic routing patterns:

- Server dynamic pages use `params: Promise<{ ... }>` because the codebase follows the newer App Router async params style.
- Some dynamic pages are client components and use `useParams` from `next/navigation`, for example parent/admin attempt pages.
- `notFound()` is used in server detail pages when API fetches fail, for example `src/app/[locale]/dashboards/admin/evaluations/[evaluationId]/page.tsx`.

## 4. UI Architecture

UI layers:

```txt
Primitive UI
  src/components/ui/*
  shadcn/Radix primitives, cva variants, semantic CSS variables

Shared app UI
  src/components/shared/*
  management headers/cards/filters, data table, dashboard cards, forms

Feature UI
  src/features/<domain>/components/*
  columns, dialogs, sidebars, cards owned by a domain

Page screens
  src/components/pages/*
  assembled dashboard/public screens with feature data and local state

Route files
  src/app/[locale]/**
  server/client composition and route params
```

Design system facts:

- `components.json` configures shadcn `new-york`, RSC enabled, TSX, CSS variables, base color `stone`, `lucide` icon library, and aliases `@/components`, `@/lib`, `@/hooks`.
- `src/components/ui/button.tsx` uses `class-variance-authority` variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes include `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
- `src/components/ui/sidebar.tsx` is a large shadcn sidebar implementation with internal context, cookie-persisted open state, mobile sheet, RTL-aware side resolution via `document.documentElement.dir`, and `Ctrl/Cmd+B` shortcut.
- `src/components/ui/sonner.tsx` reads theme from `next-themes`, but no root `ThemeProvider` is currently installed. Sonner still works; theme may fall back to system/default behavior.

Shared management components:

- `src/components/shared/management/ManagementPageHeader.tsx`: page title/subtitle, breadcrumb links, optional primary action. It currently imports `next/link`.
- `src/components/shared/management/ListFilters.tsx`: controlled search plus optional grade/class selects. Uses shadcn `Input` and `Select`; handles `"all"` sentinel values.
- `src/components/shared/management/EntityCard.tsx`: repeated CRUD card with field rows and render-prop edit/delete dialogs. It owns internal controlled/uncontrolled dialog open state and uses `GradientButton`. Coupling level is medium because it assumes edit/delete actions and card CRUD layout.
- `src/components/shared/management/EmptyState.tsx`: empty state with optional action link.
- `src/hooks/useClientPagination.ts`: local client pagination over arrays with `getPaginationMeta` and `paginateArray`.

Tables:

- `src/components/shared/data-table/DataTable.tsx`: production generic TanStack table wrapper with optional manual pagination metadata.
- `src/components/shared/data-table/DataTablePagination.tsx`: simple previous/next pagination.
- Feature columns live in files such as `src/features/evaluations/components/columns.tsx`, `attempt-columns.tsx`, `src/features/employees/components/columns.tsx`, `src/features/tests/components/columns.tsx`.
- There are likely legacy/demo table files (`src/components/data-table.tsx` appears in earlier context and dependencies include dnd-kit). Avoid importing demo-heavy tables into production routes unless inspected.

Dashboard shells:

- Admin, parent, and teacher use `SidebarProvider`, role sidebar, `SidebarInset`, and sometimes `DashboardTopBar`.
- Organization owner uses a custom fixed `OrganizationHeader` in `src/components/layouts/organizationHeader/OrganizationHeader.tsx`, content `pt-28`, and `Footer`.
- `DashboardTopBar`, `DashboardHomeLayout`, `StatsGrid`, `StatCard`, `QuickActionCard`, `WelcomeHero`, and `ActivityFeed` under `src/components/shared/dashboard` are reusable dashboard-home building blocks.

Evaluation UI:

- `src/components/evaluation/EvaluationRunner.tsx`: active parent attempt runner. It renders attempt title, progress, timer, save/submit controls, question cards, and submit modal.
- `src/features/evaluations/hooks/useEvaluationSession.ts`: the real state machine for active attempts. Do not bypass this hook for the runner.
- `src/components/evaluation/QuestionCard.tsx`, `AnswerGroup.tsx`, `Timer.tsx`, `SubmitModal.tsx`, and `AttemptSummary.tsx` compose attempt UI.
- Result views dispatch through `src/components/evaluation/results/AttemptResultView.tsx` to type-specific views: Holland, Learning Styles, Multiple Intelligences, Pride, Renzulli, or generic.

Notifications UI:

- `src/components/notifications/NotificationBell.tsx` fetches unread count/list, allows mark-all-read, and links to notifications.
- `src/components/pages/dashboards/NotificationsScreen.tsx` owns filters/pagination and uses notification hooks.

Composition pattern:

```tsx
// Server route
export default async function Page({ params }: Props) {
  const { locale } = await params
  const data = await getFeatureData()
  return <FeatureScreen initialData={data} locale={locale} />
}

// Client screen
;('use client')
export function FeatureScreen({ initialData }: Props) {
  // search/filter/dialog/pagination state
  // server action dispatch or React Query mutation
  // shared UI components
}
```

Anti-patterns to watch:

- UI primitives should not import feature/domain code.
- Hardcoded colors and gradients appear often (`bg-[#f3eefb]`, fuchsia/indigo gradients, large rounded corners). Prefer semantic tokens for new reusable components.
- Arabic strings and comments in some source files are mojibake/corrupted. Prefer `messages/ar.json` and `messages/en.json` rather than inline copy.

## 5. State Management

There is no Redux. There is no active Zustand store. `src/features/auth/store/auth-store.ts` exists as a compatibility/export shim; auth state belongs to NextAuth.

State ownership:

```txt
Auth/session state
  NextAuth session/JWT
  useSession(), getServerSession(), getToken()

Server state
  React Query in client components
  server component fetches through feature API functions

Form state
  React Hook Form + Zod for registry/server-action forms and some custom flows
  useActionState for server action responses
  raw local state in complex custom forms

Local UI state
  useState/useMemo in page screens for search, filters, dialogs, pagination

Derived state
  local filtered arrays, pagination slices, status labels, display helpers
```

React Query setup:

- `src/components/providers/QueryClientProvider.tsx` creates a module-level `const queryClient = new QueryClient()` in a client module.
- No global `defaultOptions` are configured.
- Query provider wraps the whole app inside `NextIntlClientProvider`.
- React Query is used heavily in evaluations and notifications, and lightly in users/organizations/tests/children hooks.

Important query key systems:

- `src/features/evaluations/hooks/index.ts`
  - `evaluationKeys.all`
  - `evaluationKeys.detail(id)`
  - `evaluationKeys.form(id)`
  - `evaluationKeys.available(childId)`
  - `evaluationKeys.attempts(filters)`
  - `evaluationKeys.attempt(id)`
  - `evaluationKeys.childAttempts(childId)`
- `src/features/evaluations/hooks/owner.ts`
  - owner evaluation filters/reports/summary/status/reminder keys.
- `src/features/notifications/hooks/index.ts`
  - `notificationKeys.all`
  - `notificationKeys.list(params)`
  - `notificationKeys.unreadCount()`

Important local state examples:

- `ChildrenScreen`: `search`, `gradeFilter`, `classFilter`, `useActionState` delete state, derived `filtered`, `classOptionsForGrade`, client pagination.
- `ClassesScreenClient`: search/grade filter, delete action state, local pagination.
- `AdminEvaluationsScreen`: search, evaluation type filter, local page number, manual pagination over props.
- `EvaluationRunner`: local submit confirmation dialog; delegates answers/dirty/autosave/timer to `useEvaluationSession`.
- `useEvaluationSession`: answers map, dirty flag, current time tick, last saved JSON snapshot ref, autosave timer ref.
- `NotificationsScreen`: page/filter UI state plus React Query data.

Synchronization risks:

- Server component props and React Query caches coexist. If a server-rendered list is mutated via React Query, the server props will not update unless navigation/revalidation happens. If a server-action CRUD flow mutates data, related React Query caches will not update automatically.
- Server actions call `revalidatePath` with non-locale paths such as `/dashboards/organization/classes`. In a locale-scoped app, verify that the intended cached paths are actually revalidated.
- Some mutation invalidations use broad keys such as `["attempts"]` and `["child-attempts"]`, while canonical keys include parameterized arrays. This works because partial invalidation can match prefixes, but future agents should keep keys compatible.
- Client-side filtered arrays are derived from initial props and can be stale until a route refresh/navigation occurs.

## 6. API Layer

Central wrapper:

```ts
// src/lib/api/api.ts
export const api = {
  client: clientApiFetch,
  server: serverApiFetch,
}
```

Next proxying:

- `next.config.ts` rewrites `/api/:path((?!auth/).*)` to `${process.env.BACKEND_URL}/api/:path*`.
- NextAuth routes under `/api/auth/*` stay on the frontend app.
- Client API calls use relative `/api${endpoint}` and therefore go through the rewrite, except `/api/auth/*`.
- Server API calls use `${process.env.BACKEND_URL}/api${endpoint}` directly.

Client API lifecycle in `src/lib/api/client-api-client.ts`:

```txt
clientApiFetch(endpoint, options)
  -> getSession()
  -> if session has RefreshAccessTokenError, clear token cache and signOut()
  -> add Content-Type: application/json
  -> add Authorization: Bearer session.user.accessToken
  -> fetch /api${endpoint}
  -> on 401: clear token cache, call getSession() once more, retry if token changed
  -> otherwise signOut to /auth/login and throw ApiError
  -> parse JSON
  -> if !res.ok, extract data.message and throw ApiError
  -> return typed payload
```

Server API lifecycle in `src/lib/api/server-api-clent.ts`:

```txt
serverApiFetch(endpoint, options)
  -> getServerSession(nextAuthOptions)
  -> add JSON Content-Type and Authorization if token exists
  -> fetch BACKEND_URL/api${endpoint} with cache: "no-store"
  -> parse JSON
  -> if bad request, throw ApiError(message, status, validation data)
  -> if other !ok, throw ApiError(message, status)
  -> return typed payload
```

Error model:

- `src/lib/errors/ApiError.ts` extends `Error` with `status` and optional `validationErrors`.
- Server actions convert `ApiError` to user/action state through `src/features/forms/action-errors.ts`.
- Runtime response schemas are generally not validated; TypeScript types are trusted.

Feature API inventory:

- `src/features/evaluations/api/index.ts`: admin evaluations, evaluation details/form, available evaluations for child, start attempt, attempts list/detail/child, save/submit/approve attempts, private attempt slot operations, organization owner reports/status/reminders.
- `src/features/children/api/index.ts`: children by user/org/all, child detail, create/update/delete, parent private/org children.
- `src/features/classes/api/index.ts`: classes by organization/grade/teacher, class detail, create/update/delete.
- `src/features/grades/api/index.ts`: grades by organization, detail, create/update/delete.
- `src/features/teachers/api/index.ts`: teachers by org, teacher by user id (server/client), create/delete teacher.
- `src/features/employees/api/index.ts`: employees by org, employee detail, add/update/delete.
- `src/features/users/api/index.ts`: users in roles client query and all users server query.
- `src/features/organizations/api/index.ts`: create employee, get user organization, get all organizations.
- `src/features/tests/api/index.ts`: get all tests client, create test server.
- `src/features/notifications/api/index.ts`: list/unread/mark read/dispatch client calls and list/unread server calls.
- `src/features/auth/api/index.ts`: verify email, beneficiary signup, logout, logout-all.
- `src/features/mailer/api/index.ts`: send verification email.

API risks:

- Both client and server wrappers assume JSON responses. `204 No Content` or empty responses will throw `ApiError("Invalid server response")`. This is risky for `logoutClient`, `markAllRead`, `markOneRead`, and DELETE/PATCH endpoints if the backend returns no body.
- `Content-Type: application/json` is added for every request, so real file upload/multipart support will require wrapper changes or opt-out behavior.
- Direct backend fetches exist outside wrappers in auth/NextAuth and may exist in signup flows. Keep random component-level `fetch(process.env.NEXT_PUBLIC_API_URL...)` out of new code.
- Some endpoints are hardcoded strings instead of `Endpoint` enum, for example `src/features/teachers/api/index.ts` uses `/teachers/organization/${orgId}`.

## 7. Forms & Validation

The newest reusable form system lives in `src/features/forms`.

Architecture:

```txt
schemas/*.schema.ts
  Zod schemas and inferred form value types

config/*.config.ts
  field metadata: name, type, labelKey, placeholderKey, data, defaults

config/index.ts
  formRegistry keyed by FormTypes

hooks/useFormConfig.ts
  resolves field label/placeholder with useTranslations("Forms")

components/ServerActionForm.tsx
  chooses registry or override schema/defaults/fields
  calls useServerActionForm
  renders RhfFormFields and children

hooks/useServerActionForm.ts
  react-hook-form + zodResolver
  useActionState for server actions
  converts values to FormData
  restores field errors and submitted form data from action state

parse-form-data.ts
  FormData -> string record -> schema.safeParse

action-results.ts / action-errors.ts
  normalized InitialState success/failure/validation response
```

Schemas include:

- `login.schema.ts`
- `employee.schema.ts`
- `teacher.schema.ts`
- `grade.schema.ts`
- `class.schema.ts`
- `child.schema.ts`
- `test.schema.ts`
- `common.schema.ts`
- `src/features/auth/signup/schemas/signup.schema.ts` for beneficiary signup.

Form registry keys from `src/lib/types/enums.ts`:

```txt
SIGNIN
EMPLOYEE
EMPLOYEE_UPDATE
teacher
grade
class
childOrg
childUpdate
childPrivate
childAdmin
TESTS
```

Field rendering:

- `RhfFormFields` renders fields using shadcn `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`.
- `InputTypes.TEL` uses `react-phone-number-input`.
- `InputTypes.PASSWORD` uses a local password input with show/hide state and Lucide eye icons.
- Checkbox/select/textarea delegate to older shared field components under `src/components/shared/forms`.
- Select and textarea integration is less pure RHF than text/password/phone; inspect before extending complex controlled fields.

Server action pattern:

```ts
'use server'

export async function createClassAction(
  _prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const parsed = parseFormData(formData, createClassSchema)
  if (!parsed.success) return parsed.state

  try {
    await createClass(parsed.data)
    revalidatePath('/dashboards/organization/classes')
    return actionSuccess('Actions.classes.created', StatusCode.CREATED)
  } catch (error) {
    return actionErrorState(error, formData, {
      conflict: 'Actions.classes.conflict',
    })
  }
}
```

Other form styles:

- `LoginForm` uses `react-hook-form` + Zod directly and calls `useAuth().login()`.
- `AdminCreateEvaluationScreen` is a custom client form with local state and React Query mutation.
- `TestCreationForm`/`TestCreationWizzard` use custom wizard state and FormData.
- Organization form screens such as `GradeFormScreen`, `ClassFormScreen`, and `ChildFormScreen` use `ServerActionForm` plus client-side redirect/toast behavior.

Validation consistency:

- New CRUD actions validate `FormData` with Zod.
- Some older dialogs/components may still pass raw state/messages directly.
- Server action messages are intended to be i18n keys under `Actions.*`, translated on the client by `useActionFeedback`/toast helpers. Some components still pass raw messages to `toast.success/error`.

File uploads:

- No production upload flow was found.
- `InputTypes.FILE` and `InputTypes.IMAGE` exist in enums, but API wrappers force JSON and `parseFormData` only keeps string entries. Add upload support deliberately rather than assuming existing forms can handle files.

## 8. Async & Data Fetching

Main modes:

- Server component data fetching:
  - Uses `api.server` through feature APIs.
  - Often parallelized with `Promise.all`.
  - Uses `cache: "no-store"` in the server wrapper.
- React Query:
  - Used for client-driven reads and mutations.
  - Query keys are strongest in evaluations and notifications.
- Server actions:
  - Used for CRUD submissions and deletes.
  - Return normalized action state and call `revalidatePath`.

Representative server-rendered list flow:

```txt
src/app/[locale]/dashboards/organization/children/page.tsx
  -> getCurrentOrganization()
  -> Promise.all([
       getAllChildrenByOrg(orgId),
       getGradesByOrg(orgId),
       getClassesByOrg(orgId)
     ])
  -> <ChildrenScreen childrens grades classes />

ChildrenScreen
  -> local search/grade/class filters
  -> useClientPagination(filtered, 12)
  -> deleteChildAction via useActionState
  -> toast feedback via useActionFeedback
```

Evaluation attempt flow:

```txt
Parent selects/starts evaluation
  -> useStartEvaluation(evaluationId)
  -> startEvaluationClient(evaluationId, { childId })
  -> router navigates to attempt page

src/app/[locale]/dashboards/parent/attempts/[attemptId]/page.tsx
  -> client page reads attemptId
  -> useAttempt(attemptId)
  -> if approved: AttemptResultView
  -> if submitted: waiting approval
  -> otherwise: EvaluationRunner

EvaluationRunner
  -> useEvaluationSession(attemptId)
       -> useAttempt(attemptId)
       -> useEvaluationForm(evaluationId) fallback if attempt lacks renderable questions
       -> answers map from attempt.answers
       -> autosave after dirty changes
       -> beforeunload warning while dirty
       -> auto-submit when expiresAt passes
       -> submit/save mutations
```

Notification flow:

```txt
useNotifications(params, { pollMs })
  -> useUnreadCount(refetchInterval default 30s)
  -> useNotificationsList(params)
  -> useMarkAllRead()
  -> useMarkOneRead()

NotificationBell/NotificationsScreen
  -> display unread/list
  -> invalidate notificationKeys.all after read mutations
```

Loading and error behavior:

- There are few route-level `loading.tsx`/`error.tsx` files. Most loading states are inside client components.
- Common loading primitives: `src/components/ui/skeleton.tsx`, `src/components/shared/cards/LoadingCard.tsx`, `AuthLoadingScreen`.
- Server detail pages generally `notFound()` on failed fetch.
- Client pages show cards/skeletons/toasts for loading/errors.

Scalability:

- Client filtering and pagination over full arrays is acceptable for small/medium lists, but children/classes/evaluations/attempts will need server pagination for large datasets.
- React Query hooks are scalable when keys are centralized. CRUD domains should adopt centralized keys if moving away from server actions.
- There is no Suspense data-fetching strategy beyond standard App Router server rendering.

## 9. Authentication & Authorization

Auth stack:

- `next-auth` credentials provider.
- Auth options in `src/server/auth.ts`.
- NextAuth route handler in `src/app/api/auth/[...nextauth]/route.ts`.
- JWT session strategy with `maxAge` 30 days and `updateAge` 1 day.
- Access/refresh tokens stored in JWT and exposed through `session.user`.

Login lifecycle:

```txt
LoginForm
  -> useAuth().login({ phone, password })
  -> signIn("credentials", redirect: false)
  -> Credentials.authorize()
      -> POST ${BACKEND_URL}/api/auth/login
      -> return backend user + expiresIn
  -> jwt callback stores:
      id, accessToken, refreshToken, accessTokenExpires,
      roles, phone, email, name, isEmailVerified, isPhoneVerified
  -> session callback maps token to session.user
  -> client updates session
  -> redirect path chosen by getPostLoginRedirect()
```

Token refresh:

- `src/lib/auth/token-expiry.ts` resolves TTL and expiry time.
- `src/lib/utils.ts` `refreshAccessToken(token)` POSTs to `${BACKEND_URL}/api/auth/refresh` with refresh token as bearer and JSON body.
- `src/server/auth.ts` `jwt` callback refreshes when `accessTokenExpires <= Date.now()`.
- If refresh fails, token/session gets `RefreshAccessTokenError`.
- `useInitAuth`, `useAuth`, and `clientApiFetch` respond to `RefreshAccessTokenError` by clearing token cache, showing toast/signing out.
- `src/app/api/auth/refresh/route.ts` proxies refresh calls to backend, but the main JWT refresh currently calls backend directly through `refreshAccessToken`.

Email verification:

- `src/proxy.ts` redirects unverified authenticated users from protected routes to `/{locale}/email-verfication`.
- `src/app/[locale]/email-verfication/page.tsx` is a client page for the pending verification state and can send verification email through mailer API.
- `src/app/[locale]/verify-email/page.tsx` handles token verification UI, using `verifyEmail`.
- `src/app/api/auth/verify-email/route.ts` proxies GET token verification to backend.

Role handling:

- `UserRole` enum contains `ADMIN`, `ORGANIZATIONOWNER`, `TEACHER`, `PARENT`.
- `src/features/auth/utils/rbac.ts` normalizes backend `Role[]` objects to enum names and checks `hasAnyRole`.
- `src/features/auth/utils/redirects.ts` maps role to dashboard path, but returns non-locale-prefixed paths unless a locale is passed.
- `src/proxy.ts` has its own role home logic. Keep proxy and redirect utilities aligned when changing roles.

Security risks:

- Frontend role checks are UX gates only. Backend must enforce authorization.
- `RequireRoles` default redirects are not locale-aware. Layouts should pass locale-prefixed `redirectTo` where possible.
- `src/proxy.ts` `ACCESS_MAP` lets `ADMIN` access organization/teacher/parent dashboard sections, but role layouts may still require exact roles. For example parent layout currently allows only `PARENT`, so proxy and layout gates are not perfectly equivalent.
- Checked-in `.env` exists. Do not commit secrets; rotate any secrets that were committed.

## 10. Styling System

Tailwind is configured through CSS, not a `tailwind.config.*` file.

Primary styling file:

- `src/app/[locale]/globals.css`

Key characteristics:

- Imports `tailwindcss`, `tw-animate-css`, and `shadcn/tailwind.css`.
- Defines `@custom-variant dark (&:is(.dark *))`.
- Uses `@theme inline` to map semantic tokens (`--color-background`, `--color-primary`, sidebar/chart tokens, radii, fonts).
- `:root` and `.dark` define oklch semantic variables.
- `body` applies `min-h-dvh`, background/foreground/font, and two fixed radial gradients.
- `html[dir="rtl"]` sets direction.
- Global scrollbar styling is defined.
- `.app-container` applies `max-w-7xl mx-auto px-6 lg:px-8`.
- `.between-center` applies `flex items-center justify-between`.

Theme:

- Dark token values exist.
- `next-themes` is installed and `src/components/ui/sonner.tsx` calls `useTheme()`.
- No root `ThemeProvider` or visible theme toggle was found in `src/app/[locale]/layout.tsx`; dark mode appears token-ready but not product-wired.

Responsive and RTL:

- Root layout sets document `dir` from locale.
- Some screens also set `dir` explicitly using `locale === "ar" ? "rtl" : "ltr"` or `getTextDirection(locale)` from `src/lib/i18n/locale-utils.ts`.
- `Sidebar` resolves side from document direction when `side` is not provided.
- Watch components that import `next/link` or hardcode left/right classes; use logical spacing/inset where possible for RTL.

Maintainability concerns:

- Operational dashboard screens often use decorative rounded cards and gradients. For new dashboard work, prefer denser, tokenized, task-focused UI unless matching a nearby screen.
- Hardcoded background `bg-[#f3eefb]` is repeated in dashboard layouts.
- Mojibake appears in source strings and comments. Move display strings to messages files and avoid copying corrupted text.
- `DataTablePagination` contains mojibake for the separator between page and item count.

## 11. Performance Review

Positive signals:

- Server route pages often fetch independent resources with `Promise.all`.
- Server API wrapper uses `cache: "no-store"` to avoid stale authenticated data.
- React Query is used for frequently changing client flows such as attempts and notifications.
- `next/image` is used for public/static assets.
- `next.config.ts` enables `reactCompiler: true`.
- App Router server components are used for many initial data fetches.

Rerender/hydration risks:

- Many components are client components, including home sections and many page screens. This increases JS and hydration cost.
- Dynamic attempt pages for admin/parent are client route pages that fetch after hydration rather than server rendering.
- `suppressHydrationWarning` is set on `<body>`, which can hide legitimate hydration mismatches.
- `Sidebar` reads `document.documentElement.dir` during render after client hydration. It is guarded by client-only component usage, but direction-dependent rendering should be tested in Arabic/English.

Bundle risks:

- Heavy dependencies are installed: dnd-kit, Recharts, Swiper, TanStack table, multiple phone input libraries. Only import them where needed.
- Avoid putting chart/DnD/table-builder components in broad shared shells.
- Multiple phone input libraries are installed (`react-international-phone`, `react-phone-input-2`, `react-phone-number-input`); current RHF field uses `react-phone-number-input`.

Data-size risks:

- Client-side filtering/pagination over full arrays appears in organization management and admin evaluation screens.
- No virtualization was found.
- Admin/attempt/evaluation lists should move to server pagination before datasets become large.

Paint/layout risks:

- Fixed radial-gradient body background can be a paint cost on low-end devices.
- Organization layout manually coordinates a fixed header with `pt-28`; if header height changes, content can overlap or leave excessive space.
- Large rounded cards and shadows across dense lists can be heavier than simple tables for large datasets.

Debug/code hygiene risks:

- `console.log` exists in route files such as `src/app/[locale]/verify-email/page.tsx`, `src/app/[locale]/dashboards/admin/tests/page.tsx`, `src/app/[locale]/dashboards/organization/grades/page.tsx`, and `src/app/[locale]/dashboards/organization/employees/[employeeId]/page.tsx`.
- Remove debug logging when touching those files.

## 12. Technical Debt & Risks

High risk:

- **Route typo contracts:** `unautharized`, `email-verfication`, `chose-role`, and enum misspellings are used by code. Renaming them without redirects will break navigation and middleware.
- **Auth logic duplication:** role home mapping exists in `src/proxy.ts` and `src/features/auth/utils/redirects.ts`. Layout gates add another layer. Changes must be made together.
- **JSON-only API wrappers:** empty responses and file uploads can break. Several mutation endpoints are typed as `void` but wrappers still parse JSON.
- **Committed environment file:** `.env` exists in the repo root. Secrets should not be committed.
- **Mojibake in source:** corrupted Arabic strings/comments are present in components and auth code. This can leak broken UI and makes maintenance error-prone.

Medium risk:

- **Mixed server actions and React Query:** without clear ownership, cache invalidation and server-rendered props can drift.
- **Locale-unsafe links:** `next/link` and `next/navigation` are used inside locale-scoped screens. Prefer `@/i18n/navigation`.
- **Shared/type sprawl:** cross-feature type files and feature types overlap.
- **Design token bypass:** repeated hardcoded colors/gradients make theming and consistency harder.
- **No global query defaults:** each query must remember stale/refetch behavior.
- **Form field abstraction gaps:** select/textarea/checkbox are not as tightly integrated with RHF as text/password/phone.

Accessibility risks:

- Icon buttons are not uniformly labelled outside shadcn primitives.
- Custom cards/actions need contrast checks, especially gradient buttons and muted text on colored backgrounds.
- Some shared empty/table text is hardcoded English.
- Some sidebar/nav/demo data may use placeholder `href="#"` or placeholder avatars if not customized.

Scalability risks:

- Client filtering over entire datasets will not scale to thousands of rows.
- Organization header is a separate shell from sidebar dashboards, so cross-role layout improvements must be duplicated.
- Evaluation active attempt state is complex and centralized in `useEvaluationSession`; bypassing it risks losing autosave/expiry/dirty behavior.

## 13. Recommended Refactors

HIGH:

- Remove committed secrets from `.env`, rotate affected secrets, and document required environment variables.
- Normalize auth/role redirect mapping into one shared server-safe module used by `src/proxy.ts` and `src/features/auth/utils/redirects.ts`.
- Fix JSON-empty response handling in `clientApiFetch` and `serverApiFetch` before relying on `void` mutation endpoints.
- Make locale-aware navigation the default in localized screens; replace `next/link`/`next/navigation` imports where feasible.
- Move hardcoded/corrupted Arabic UI strings into `messages/ar.json` and verify encoding.
- Audit `RequireRoles` redirect paths for locale awareness and consistency with `ACCESS_MAP`.

MEDIUM:

- Standardize data mutation ownership per feature:
  - server-rendered CRUD: server actions + route refresh/revalidation
  - client-owned flows: React Query mutations + centralized query keys
- Centralize query keys for children/classes/grades/employees/teachers if those lists become React Query driven.
- Consolidate table components and document the production `DataTable` import path.
- Add server pagination for admin attempts/evaluations/users/children and organization children/classes if datasets are expected to grow.
- Add route-level `loading.tsx`/`error.tsx` for major dashboards.
- Replace repeated `bg-[#f3eefb]` and gradients with semantic tokens or component variants.
- Add multipart/upload support deliberately if file/image fields become real product requirements.

LOW:

- Add a real `ThemeProvider` and toggle if dark mode is supported; otherwise remove misleading theme dependency surface.
- Remove debug `console.log` calls.
- Add basic accessibility checks for icon-only controls and custom cards.
- Reduce duplicate phone input dependencies.
- Document backend response shapes or introduce runtime parsing for high-risk API contracts.

## 14. AI Guidance Section

Future AI agents should follow these conventions.

Preferred placement:

- New route: thin `page.tsx` under `src/app/[locale]/...`.
- New route layout: only when the route subtree needs a distinct shell or guard.
- New backend call: `src/features/<domain>/api/index.ts`.
- New server action: `src/features/<domain>/actions/*.action.ts`.
- New query hook: `src/features/<domain>/hooks/index.ts` with exported stable query keys.
- New feature component: `src/features/<domain>/components` when domain-owned.
- New page-level composition: `src/components/pages/...` if matching existing screen placement.
- New primitive: `src/components/ui` only if domain-free and shadcn-style.
- New shared app pattern: `src/components/shared/<area>`.

Preferred server route pattern:

```tsx
export default async function Page({ params }: Props) {
  const { locale } = await params
  const data = await getSomething()
  return <SomeScreen locale={locale} data={data.items} />
}
```

Preferred client screen pattern:

```tsx
'use client'

export function SomeScreen({ data }: Props) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => filterData(data, search), [data, search])
  return <SharedPattern data={filtered} />
}
```

API rules:

- Use `api.server` in server components, server actions, and server helpers.
- Use `api.client` in React Query hooks and client components.
- Do not call `BACKEND_URL` or `NEXT_PUBLIC_API_URL` directly from random components.
- If an endpoint returns no body, update the wrapper or endpoint handling before typing it as `void`.
- If adding file uploads, do not use current JSON wrapper unchanged.

Auth rules:

- Treat `src/proxy.ts` as the coarse route gate.
- Add `RequireRoles` to protected layouts for defense in depth.
- Use `getServerSession(nextAuthOptions)` for server auth.
- Use `useAuth()` for client auth and logout/login helpers.
- Do not introduce a separate global user store.
- When adding/changing roles, update `UserRole`, proxy `ACCESS_MAP`/role home, redirect utilities, sidebars, and relevant layouts.

Routing rules:

- Prefer `@/i18n/navigation` exports for localized links, router, pathname, and redirects.
- Be careful with typo route segments. They are real URLs.
- For dynamic server pages, follow the existing `params: Promise<...>` style.
- Use `notFound()` for missing server-fetched details when that matches nearby pages.

Forms rules:

- For new CRUD forms, prefer `ServerActionForm` + Zod schema + form registry config.
- Server actions should use `parseFormData`, return `actionSuccess`/`actionErrorState`, and revalidate or redirect intentionally.
- Server action messages should be translation keys, usually under `Actions.*`.
- Translate action results on the client with `useActionFeedback` or `src/lib/toast/app-toast.ts`.
- Inspect `RhfFormFields` before adding advanced field types; select/textarea integration may need improvement.

State rules:

- Keep URL/initial data in App Router.
- Keep authenticated identity in NextAuth.
- Keep client server-state in React Query.
- Keep form state in React Hook Form or local wizard state.
- Keep transient UI state local unless multiple distant components need it.
- Avoid new global state libraries without a clear cross-app state problem.

Styling rules:

- Use shadcn primitives and `cn()` from `src/lib/utils.ts`.
- Prefer semantic Tailwind tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`) over hardcoded hex values.
- Preserve RTL: root layout sets `dir`, but complex screens may still need explicit direction or logical CSS classes.
- Put display strings in `messages/en.json` and `messages/ar.json`, not inline bilingual text.
- For operational dashboard screens, favor dense, predictable, task-focused UI over marketing-style decoration.

Dangerous areas:

- `src/proxy.ts` and `src/features/auth/utils/redirects.ts`: duplicated auth redirect logic.
- `src/features/evaluations/hooks/useEvaluationSession.ts`: active attempt state, autosave, expiry, dirty warning, submit. Do not bypass casually.
- `src/lib/api/client-api-client.ts` and `src/lib/api/server-api-clent.ts`: JSON assumptions affect all API calls.
- `src/components/ui/sidebar.tsx`: complex layout/context/RTL behavior; test both desktop and mobile if editing.
- Organization dashboard shell: fixed header plus `pt-28` content padding.
- Route typo enums in `src/lib/types/enums.ts`.

Anti-patterns to avoid:

- Do not import feature/domain modules inside `src/components/ui`.
- Do not add direct backend fetches in page/client components.
- Do not add hardcoded Arabic strings into TSX.
- Do not rely only on client-side guards for protected screens.
- Do not rename typo routes/enums without redirects and a migration plan.
- Do not add more duplicate table/form abstractions unless consolidating.

Useful mental model:

```txt
App Router owns URL, layouts, and initial server render.
proxy.ts owns coarse locale/auth/role redirects.
NextAuth owns identity and token lifecycle.
Feature API modules own backend endpoint calls.
React Query owns client server-state.
Server actions own many CRUD mutations.
Shared components own visual patterns.
Feature components own domain behavior.
```
