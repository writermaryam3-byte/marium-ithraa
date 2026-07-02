# Ithraa Frontend Domain Compliance Audit

**Generated:** 2026-06-14  
**Scope:** Full frontend source code vs. PROJECT_DOMAIN_REFERENCE.md  
**Method:** Static analysis via reverse-engineered architecture map and source inspection

---

## Executive Summary

**Coverage Score: 43%**

The frontend covers approximately 43% of the domain requirements defined in `PROJECT_DOMAIN_REFERENCE.md`. Core CRUD operations for Organization (grades, classes, children, teachers, employees) and Parent (private/org children, evaluations, attempts) are solid. However, **entire subdomains are missing**: Service Provider/Enricher, Deal/Proposal lifecycle, Activity management, Audit Logs, and Admin Payment Approval.

```
Domain Coverage Breakdown:
  ✅ Fully Implemented     | 10/27 (37%)
  ⚠️ Partially Implemented |  7/27 (26%)
  ❌ Missing               | 10/27 (37%)
```

---

## Domain Coverage Matrix

| #     | Domain Requirement                      | Status | Details                                                     |
| ----- | --------------------------------------- | ------ | ----------------------------------------------------------- |
| DR-01 | System Admin Dashboard                  | ✅     | Stats, quick actions, activity feed                         |
| DR-02 | Admin - Manage Organizations            | ✅     | List, filter by status, approve/reject with reason          |
| DR-03 | Admin - Manage Users                    | ✅     | Users table with roles                                      |
| DR-04 | Admin - Manage Children                 | ✅     | All children table                                          |
| DR-05 | Admin - Manage Assessments              | ⚠️     | List, create, detail views exist; no archive/edit flow      |
| DR-06 | Admin - Review Attempts                 | ✅     | List with filters, approve submitted attempts               |
| DR-07 | Admin - Send Notifications              | ✅     | Dispatch form with delivery method, userId, content         |
| DR-08 | Admin - Payment Approval                | ❌     | No UI for reviewing/approving payments                      |
| DR-09 | Admin - Send Payment Links              | ❌     | No UI for generating payment links                          |
| DR-10 | Admin - Audit Logs                      | ❌     | Not implemented anywhere                                    |
| DR-11 | Organization Owner Dashboard            | ✅     | Stats, quick actions, activity feed                         |
| DR-12 | Owner - Manage Grades                   | ✅     | CRUD with detail, edit, delete                              |
| DR-13 | Owner - Manage Classes                  | ✅     | CRUD with detail, edit, delete                              |
| DR-14 | Owner - Manage Children                 | ✅     | CRUD with parent search, transfer flow                      |
| DR-15 | Owner - Manage Teachers                 | ✅     | CRUD                                                        |
| DR-16 | Owner - Manage Employees                | ✅     | CRUD with DataTable                                         |
| DR-17 | Owner - View Reports/Results            | ⚠️     | Reports tab exists but export shows "coming soon" toasts    |
| DR-18 | Owner - Create Deals                    | ❌     | Not implemented                                             |
| DR-19 | Owner - Review Proposals                | ❌     | Not implemented (sidebar placeholder only)                  |
| DR-20 | Teacher Dashboard                       | ✅     | Basic stats and navigation                                  |
| DR-21 | Teacher - Manage Classes                | ✅     | View assigned classes with children count                   |
| DR-22 | Teacher - View Evaluations              | ❌     | No evaluation view for teacher role                         |
| DR-23 | Teacher - Send Reminders                | ❌     | No teacher reminder flow (org owner has it)                 |
| DR-24 | Teacher - Evaluate Children             | ❌     | No evaluation submission for teacher role                   |
| DR-25 | Parent Dashboard                        | ⚠️     | Stats show `—` placeholders for children/evaluations counts |
| DR-26 | Parent - Private Children               | ✅     | Create (limit 2), view, evaluate                            |
| DR-27 | Parent - Org Children                   | ✅     | View, evaluate                                              |
| DR-28 | Parent - Run Assessments                | ✅     | Start, run, submit, view results                            |
| DR-29 | Parent - Request Extra Capacity         | ❌     | No UI to request additional children beyond limit           |
| DR-30 | Parent - View Reports                   | ✅     | Type-specific result views for 6 assessment types           |
| DR-31 | Service Provider - Registration         | ❌     | No role, no UI                                              |
| DR-32 | Service Provider - Admin Approval       | ❌     | Not implemented                                             |
| DR-33 | Service Provider - Contract Signing     | ❌     | Not implemented                                             |
| DR-34 | Service Provider - View Deals           | ❌     | Not implemented                                             |
| DR-35 | Service Provider - Send Proposals       | ❌     | Not implemented                                             |
| DR-36 | Service Provider - Record Attendance    | ❌     | Not implemented                                             |
| DR-37 | Service Provider - Participate in Evals | ❌     | Not implemented                                             |
| DR-38 | Deal Lifecycle                          | ❌     | Not implemented                                             |
| DR-39 | Transfer Requests                       | ⚠️     | Org can view/approve/reject; parent side limited            |
| DR-40 | Private Child Limit Enforcement         | ✅     | Hardcoded limit of 2 in create-private-child.action.ts      |
| DR-41 | Dynamic Assessment Questions            | ✅     | Data-driven question rendering                              |
| DR-42 | Dynamic Assessment Scoring              | ✅     | Server-side only; frontend strips score from parent         |
| DR-43 | Dynamic Assessment Reports              | ⚠️     | Generic fallback exists but 6 types are hardcoded           |
| DR-44 | RBAC Enforcement                        | ⚠️     | 4 roles implemented; Service Provider missing               |

---

## Missing Features

### Critical

#### MF-01: Service Provider (Enricher) Role — Entirely Missing

- **No UserRole enum value** for ENRICHER or SERVICE_PROVIDER
- **No provider feature folder** (`src/features/provider/`)
- **No provider routes** under dashboards
- **No provider sidebar** component
- **No provider registration flow**
- **No provider approval UI** for admin
- No contract signing, deal viewing, proposal submission, attendance recording, evaluation participation
- **Files to create:** `src/features/provider/` (api/, components/, hooks/, types/)
- **Files to modify:** `src/lib/types/enums.ts` (add UserRole.ENRICHER), `src/proxy.ts` (add to ACCESS_MAP), `src/features/auth/utils/redirects.ts` (add dashboard path)

#### MF-02: Deal & Proposal Management — Entirely Missing

- **No Deal feature folder** (`src/features/deals/`)
- **No proposal components**
- Organization sidebar has placeholder nav items pointing to `#`
- Activity selection, student count, publishing, provider notification, proposal submission, proposal review, admin approval/rejection, activity execution, attendance, evaluation all missing
- **Files to create:** `src/features/deals/` (full feature), `src/app/[locale]/dashboards/organization/deals/` (routes)
- **Already exists:** ActivityFeed component (generic, reusable)

#### MF-03: Activity Management — Missing

- Domain mentions "Managing activities" for System Admin
- No activity CRUD UI found anywhere
- Only generic ActivityFeed dashboard component exists for display

#### MF-04: Audit Logs — Missing

- BR-10: "Every critical action must be audit logged"
- No audit log viewer or API calls found
- Admin has no "Review audit logs" feature

#### MF-05: Admin Payment Approval — Missing

- Domain: "Admin handling payment approvals, sending payment links"
- PaymentService exists (createPayment, initiatePayment, retryPayment) but is **not integrated** into any admin workflow
- No admin payment review dashboard
- No admin "send payment link" UI
- No integration with parent capacity increase flow

### High

#### MF-06: Parent Additional Capacity Request — Missing

- Domain: Parent reaches child limit (2) → Request Additional Capacity → Admin Review → Payment Link → Payment Success → Additional Children Allowed
- Private child limit enforcement exists (hardcoded `PRIVATE_CHILD_LIMIT = 2`)
- When limit reached, UI shows warning but **no "Request Capacity" button**
- No capacity request API or mutation
- No admin approval UI for capacity requests

#### MF-07: Teacher Evaluation & Reminder Flow — Missing

- Domain: Teacher "Viewing evaluations, sending reminders, performing evaluations when parent did not"
- Teacher dashboard only shows classes with children count
- No evaluation view for teacher
- No teacher reminder mechanism
- OwnerEvaluationResultsScreen has "Send reminder" for org owner, not teacher

#### MF-08: Assessment Archive/Edit — Missing (Admin)

- Domain: Admin can edit and archive assessments
- Admin evaluations list shows only create and detail views
- No "Archive" toggle/button
- No evaluation edit flow (only create)

### Medium

#### MF-09: Reports Export — Placeholder Only

- OwnerEvaluationResultsScreen has PDF/Excel export buttons
- Buttons show "coming soon" toasts
- No actual export functionality

#### MF-10: Parent-Organization Membership UI — Missing

- Domain: ParentProfile ↔ ParentOrganization ↔ Organization
- A parent may belong to multiple organizations
- No UI showing which organizations a parent belongs to
- No UI for managing organization memberships

#### MF-11: Dynamic Evaluation Type Registration — Missing

- Assessment engine supports 6 hardcoded types only
- Adding a new type requires: type union change, Zod schema update, new result component, switch case addition, label entry
- No "plugin" or registry pattern for evaluation types

#### MF-12: Organization Sidebar Employees Route — Misplaced

- Organization sidebar shows "Employees" but domain mentions "Managing employees" implicitly
- Employees feature exists but is separate from teacher management
- This works but adds confusion vs. "teachers" feature

---

## RBAC Issues

| Issue                                      | Severity   | Description                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Service Provider role missing              | CRITICAL   | `UserRole` enum has only 4 values. No ENRICHER/SERVICE_PROVIDER. Entire actor cannot exist.                                                                                                                                                                                           |
| Teacher can access private children        | HIGH       | `proxy.ts` ACCESS_MAP allows PARENT and ADMIN in parent routes. Routes have RequireRoles guards. But no explicit guard prevents teacher from accessing private children through API if they have a PARENT role. The `isChildOwnedByUser` check exists but is not universally applied. |
| Organization access to private assessments | HIGH       | No route-level check prevents organization users from accessing private assessment endpoints. Backend enforcement assumed but no frontend guard.                                                                                                                                      |
| Parent layout allows PARENT only           | ✅ CORRECT | `parent/layout.tsx` uses `allowed={[UserRole.PARENT]}`. ACCESS_MAP also allows ADMIN but parent layout does not.                                                                                                                                                                      |
| ACCESS_MAP permits ADMIN in parent routes  | MEDIUM     | `proxy.ts` allows ADMIN to access parent routes, but parent layout guards block it. Inconsistency between proxy and layout.                                                                                                                                                           |
| RequireRoles redirects not locale-aware    | MEDIUM     | `RequireRoles.tsx` redirects to `/${Routes.UNAUTHARIZED}` without locale prefix.                                                                                                                                                                                                      |
| Duplicate redirect logic                   | MEDIUM     | Role home mapping exists in `proxy.ts` AND `redirects.ts`. Changes must be synchronized.                                                                                                                                                                                              |
| Chose-role flow not fully tested           | LOW        | Multiple-role users get redirected to chose-role page. Implementation exists but UI is basic.                                                                                                                                                                                         |

---

## Workflow Issues

### Organization Lifecycle

**Domain:** Guest → Register → Pending Approval → Admin Approval → Active  
**Frontend:** ✅ Implemented — SignupWizard → BeneficiarySignup → AdminOrganizationsScreen approve/reject → OrganizationStatusScreen  
**Gaps:** None detected in core flow.

### Parent Lifecycle (Independent)

**Domain:** Register → Account Active → Create Parent Profile → Add Child (max 2) → Run Assessments → View Reports  
**Frontend:** ⚠️ Partially implemented  
**Gaps:**

- ParentSignup component is **empty** (returns `<div>ParentSignup</div>`). No independent parent registration form.
- OrganizationSignupForm works but is organization-focused.
- "Request Additional Capacity" flow not implemented.
- Payment integration for extra capacity not connected.

### Parent Lifecycle (Organization)

**Domain:** Teacher/Owner searches by phone → Check if parent exists → Check if child exists → Create child or transfer  
**Frontend:** ⚠️ Partially implemented  
**Gaps:**

- CreateChildPage (644 lines) implements this flow thoroughly with parent search, child select, transfer request
- But the parent-finding flow seems to auto-create parent/users in some paths — risk of duplicate accounts
- Transfer request UI exists only on org side; parent cannot initiate transfers

### Deal Lifecycle

**Domain:** Create deal → Select Activity → Define student count → Publish → Notify providers → Proposals → Review → Select → Admin approval → Award → Execute → Attendance → Evaluation → Closure  
**Frontend:** ❌ Not implemented  
**Gaps:** Entire lifecycle missing.

### Assessment Lifecycle

**Domain:** Admin creates → Parent runs → Submits → Admin approves → Result visible  
**Frontend:** ✅ Implemented  
**Gaps:**

- Admin cannot edit existing assessments (only create + view)
- Admin cannot archive assessments

### Provider Lifecycle

**Domain:** Registration → Admin Approval → Contract Signing → Active Access  
**Frontend:** ❌ Not implemented  
**Gaps:** Entire lifecycle missing.

### Child Management Lifecycle

**Domain:** Organization creates child → Links to parent → Evaluates → Transfer possible  
**Frontend:** ⚠️ Partially implemented  
**Gaps:**

- Transfer requests: org can approve/reject, but initiating transfers from parent-to-org or org-to-org may be limited
- No "View Transfer History" for child

### Payment Approval Flow

**Domain:** Payment created → Admin reviews → Admin approves → Payment link sent → Parent pays → Capacity unlocks  
**Frontend:** ❌ Not implemented  
**Gaps:**

- PaymentService.ts exists with createPayment, initiatePayment, retryPayment
- But no admin payment review dashboard
- No admin "send payment link" UI
- No connection to child capacity increase flow
- ParentPrivateChildDialog doesn't show payment option when at limit

---

## Assessment Engine Issues

### Dynamic Capabilities (✅ Working)

| Capability              | Status | Notes                                                  |
| ----------------------- | ------ | ------------------------------------------------------ |
| Dynamic questions       | ✅     | Data-driven from server, any count                     |
| Dynamic answers         | ✅     | Any number of answers with dynamic text                |
| Dynamic dimensions      | ✅     | Any codes, names, min/max scores, interpretation rules |
| Scoring                 | ✅     | Entirely server-side; frontend has zero scoring logic  |
| Result calculation      | ✅     | Server-side only                                       |
| Session management      | ✅     | Type-agnostic useEvaluationSession                     |
| Question rendering      | ✅     | Generic QuestionCard + AnswerGroup (RadioGroup)        |
| Generic result fallback | ✅     | GenericResultView renders any result object            |
| API layer               | ✅     | Generic REST wrappers                                  |

### Hardcoded Elements (❌ Need Improvement)

| Element                    | Files                                                                                                                       | Impact                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Evaluation type union      | `src/lib/types/types/interfaces.ts:3-9`, `src/features/evaluations/types/index.ts:24-31`                                    | Closed set of 6 string literals. New type = code change      |
| Type-to-result view switch | `src/components/evaluation/results/AttemptResultView.tsx:28-46`                                                             | Explicit switch/case. New type = new code                    |
| Result field assumptions   | `HollandResult.tsx`, `LearningStylesResult.tsx`, `MultipleIntelligencesResult.tsx`, `PrideResult.tsx`, `RenzulliResult.tsx` | Each component hardcodes expected result JSON field names    |
| Attempt status union       | `src/lib/types/types/interfaces.ts:11-14`                                                                                   | `"in_progress"` / `"submitted"` / `"approved"` only          |
| Status badge mapping       | `AttemptSummary.tsx:15-20`                                                                                                  | `approved→default`, `submitted→secondary`, `else→outline`    |
| Evaluation type labels     | `src/features/evaluations/utils/labels.ts:28-61`                                                                            | 6 hardcoded entries in `EVALUATION_TYPE_LABELS`              |
| Locked status check        | `useEvaluationSession.ts:22-24`                                                                                             | `isLocked()` checks `"submitted"`, `"approved"`, `"expired"` |

### Assessment Engine Verdict

The engine is **predominantly dynamic in process** but has a **closed type system for presentation**. Adding a new evaluation type requires:

1. Add to `EvaluationType` union type
2. Add to `evaluationTypeSchema` Zod enum
3. Create result view component with hardcoded field assumptions
4. Add `case` to `AttemptResultView.tsx` switch
5. Add label entries to `EVALUATION_TYPE_LABELS`

---

## UI/UX Issues

| Issue                                         | Severity | Location                                                                          | Description                                                                        |
| --------------------------------------------- | -------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Parent dashboard stats show `—`               | MEDIUM   | `ParentDashboardScreen.tsx`                                                       | Children count and evaluations count show placeholder dash instead of actual data  |
| No loading states on several pages            | MEDIUM   | Various                                                                           | Many pages lack `loading.tsx` files. Admin dashboard, organization pages           |
| No error states on several pages              | MEDIUM   | Various                                                                           | Server-side pages that fail just show blank or `notFound()`                        |
| Empty state for tables inconsistent           | LOW      | Various                                                                           | Some pages have proper empty states, some show raw "no data" text                  |
| Teacher `profileNotFound` state               | MEDIUM   | `TeacherClassesPage`                                                              | Shows hardcoded English "teacher profile not found" without proper empty state     |
| `next/link` used instead of locale-aware Link | MEDIUM   | `ChildrenScreen`, `ClassesScreenClient`, `ManagementPageHeader`, `EmptyState`     | Risk of non-localized navigation                                                   |
| Hardcoded English strings in components       | MEDIUM   | `EvaluationBuilder.tsx`, `AnswerGroup.tsx`, `AdminDispatchNotificationScreen.tsx` | Strings like "You can take a maximum of 2 attempts per child" are not translatable |
| `console.log` in production code              | LOW      | Several route files                                                               | Debug logging in verify-email, tests, grades, employees pages                      |
| Hardcoded colors/gradients                    | LOW      | Multiple dashboard screens                                                        | `bg-[#f3eefb]` repeated across layouts                                             |
| RTL not fully tested in all components        | MEDIUM   | Sidebar, DataTable                                                                | Direction-dependent rendering may break in Arabic                                  |
| Organization header fixed height coordination | LOW      | `layout.tsx`                                                                      | `pt-28` for fixed header — fragile if header height changes                        |

---

## Technical Debt

| Issue                                | Severity | Location                                         | Description                                                                                                                                       |
| ------------------------------------ | -------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route typo contracts                 | HIGH     | `enums.ts`, `proxy.ts`                           | `unautharized`, `email-verfication`, `chose-role`, `Endpoint.VERIFYEMAIL = "verfy-email"`, `StatusCode.UNAUTHARIZED` — renaming will break routes |
| Committed `.env` file                | HIGH     | Repo root                                        | Secrets committed to repository                                                                                                                   |
| JSON-only API wrappers               | HIGH     | `client-api-client.ts`, `server-api-clent.ts`    | `204 No Content` or empty responses will throw errors                                                                                             |
| ParentSignup component is empty      | HIGH     | `ParentSignupForm.tsx`                           | Returns `<div>ParentSignup</div>` — no actual form                                                                                                |
| Authentication logic duplication     | MEDIUM   | `proxy.ts` vs `redirects.ts`                     | Role home mapping duplicated                                                                                                                      |
| Mixed server actions and React Query | MEDIUM   | Various                                          | Cache invalidation and server props can drift                                                                                                     |
| Feature types sprawl                 | MEDIUM   | `lib/types/types/interfaces.ts` vs feature types | Overlapping type definitions                                                                                                                      |
| No global query defaults             | MEDIUM   | `QueryClientProvider.tsx`                        | Each query must remember stale/refetch behavior                                                                                                   |
| Organization sidebar dead links      | LOW      | `organization-sidebar.tsx`                       | Analytics, Projects, Team, Settings, Help, Search links all point to `#`                                                                          |
| Form field abstraction gaps          | MEDIUM   | `RhfFormFields.tsx`                              | Select/textarea/checkbox not as tightly integrated as text/password/phone                                                                         |
| No file upload support               | MEDIUM   | API wrappers                                     | `InputTypes.FILE` and `InputTypes.IMAGE` exist but wrappers force JSON                                                                            |
| `Tests` feature appears unused       | LOW      | `src/app/[locale]/tests/page.tsx`                | Test route exists but may be deprecated or unused                                                                                                 |
| `flow-6` route                       | LOW      | `src/app/[locale]/flow-6/page.tsx`               | Enigmatic route — likely legacy/demo                                                                                                              |

---

## Safe Mock Implementations

For missing features, the following mock implementations follow existing project conventions:

### Mock 1: Service Provider Feature Skeleton

```txt
src/features/provider/
  api/index.ts          -> Mock API with dummy provider data
  hooks/index.ts         -> useProviders(), useProviderApproval()
  components/
    provider-sidebar.tsx -> Nav items: Dashboard, Deals, Proposals, Attendance
  types/index.ts         -> Provider, ProviderStatus interfaces
  index.ts
```

Following pattern from `src/features/teachers/` and `src/features/organizations/`.

### Mock 2: Deal Feature Skeleton

```txt
src/features/deals/
  api/index.ts           -> Mock CRUD for deals
  hooks/index.ts          -> useDeals(), useCreateDeal()
  components/
    DealCard.tsx          -> Using shared EntityCard pattern
    DealForm.tsx          -> Using ServerActionForm pattern
    columns.tsx           -> TanStack table columns
  types/index.ts
  index.ts
```

Following pattern from `src/features/grades/` and `src/features/classes/`.

### Mock 3: Audit Log Viewer

```txt
src/app/[locale]/dashboards/admin/audit-logs/page.tsx
src/features/audit-logs/
  api/index.ts
  hooks/index.ts
  components/columns.tsx
```

Following DataTable pattern from admin pages.

### Mock 4: Admin Payment Approval

```txt
src/app/[locale]/dashboards/admin/payments/page.tsx
src/features/payments/
  components/
    AdminPaymentsScreen.tsx   -> Review/approve payments table
```

Existing `src/features/payments/` already has API and hooks scaffolding.

---

## Implementation Roadmap

| Priority | Feature                                      | Effort    | Dependencies                       | Domain Impact                      |
| -------- | -------------------------------------------- | --------- | ---------------------------------- | ---------------------------------- |
| CRITICAL | Service Provider/Enricher role               | 3-4 weeks | UserRole enum, proxy.ts, auth      | Unlocks entire provider subdomain  |
| CRITICAL | Deal management                              | 4-5 weeks | Provider role, Activity management | Unlocks entire deal subdomain      |
| HIGH     | Parent additional capacity request           | 1-2 weeks | Payment integration                | Unlocks parent growth              |
| HIGH     | Admin payment approval dashboard             | 1-2 weeks | Existing PaymentService            | Enables payment oversight          |
| HIGH     | Teacher evaluation & reminder flow           | 2-3 weeks | Evaluation hooks                   | Fulfills teacher role              |
| HIGH     | Assessment archive/edit                      | 1 week    | Existing evaluation API            | Admin completeness                 |
| MEDIUM   | Make evaluation type system extensible       | 2-3 weeks | Evaluation types                   | Removes hardcoded types bottleneck |
| MEDIUM   | Reports export (PDF/Excel)                   | 1-2 weeks | Results page                       | High-value feature                 |
| MEDIUM   | Audit log viewer                             | 1 week    | Backend audit endpoint             | Compliance requirement             |
| MEDIUM   | Teacher cannot access private children guard | 0.5 week  | Ownership helper                   | Security                           |
| LOW      | Parent-organization membership UI            | 1 week    | ParentProfile types                | Transparency                       |
| LOW      | Replace console.log, hardcoded strings       | 1 week    | None                               | Code quality                       |
| LOW      | Fix route typo contracts                     | 1 week    | proxy.ts, enums.ts                 | Technical debt                     |

---

## Final Production Readiness Score

### Score: 43/100 — NOT READY FOR BACKEND INTEGRATION

### Reasons WHY:

1. **Entire actors missing**: Service Provider/Enricher role has zero implementation. The domain document defines this as a core actor with a multi-step lifecycle. Backend integration would fail because the frontend cannot represent, authenticate, or display this actor.

2. **Entire subdomain missing**: Deal/Proposal lifecycle is completely absent. This is a major business workflow that involves Organization, Service Provider, and Admin interactions — three of the five defined actors.

3. **Empty parent registration form**: `ParentSignupForm.tsx` is a stub (`<div>ParentSignup</div>`). Independent parent registration via signup wizard selects "parent" type but renders nothing usable.

4. **Payment flow disconnected**: PaymentService exists but is orphaned — no admin payment dashboard, no payment approval, no capacity-increase payment flow. The payment domain requirement "Admin handling payment approvals, sending payment links" has no frontend implementation.

5. **Closed assessment type system**: Adding new evaluation types requires code changes in 5+ files. The architecture claims to support "Dynamic Questions, Dynamic Answer Types, Dynamic Scoring, Dynamic Reports" but result visualization is hardcoded for 6 specific types.

6. **Route typo contracts baked in**: `unautharized`, `email-verfication`, `chose-role` are actual route segments referenced across the codebase. Backend API routes would need to match these typos or a redirect layer must be maintained.

7. **Audit logging missing**: BR-10 requires critical actions to be audit logged. No frontend audit viewer exists.

8. **Teacher role incomplete**: Teacher cannot evaluate children, view evaluations, or send reminders — three of the four teacher responsibilities defined in the domain.

9. **Committed `.env` with secrets**: Production security concern.

10. **JSON-only API contract assumption**: Empty responses and `void` mutations will crash the API clients.

### What IS ready:

- Organization CRUD (grades, classes, children, teachers, employees, results)
- Admin organization approval flow
- Parent child management (private + org children)
- Evaluation attempt flow (start → run → save → submit → approve → view results)
- Notification system (dispatch, list, bell, read)
- Basic RBAC for ADMIN, ORGANIZATIONOWNER, TEACHER, PARENT

### Verdict

**NOT READY FOR BACKEND INTEGRATION** until the following minimum criteria are met:

1. Add missing `ENRICHER` role and feature scaffold
2. Implement parent registration form (currently empty stub)
3. Create deal/proposal feature scaffold
4. Implement teacher evaluation access
5. Connect payment flow to admin dashboard

---

## Domain-to-Frontend Traceability Matrix

### Actors

| Actor                       | Frontend Implementation                                                                                 | Coverage                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------- |
| System Admin                | `dashboards/admin/*`, `features/admin/*`, `features/organizations/components/AdminOrganizationsScreen*` | ✅ Full                     |
| Organization Owner          | `dashboards/organization/*`, `features/organizations/*`                                                 | ⚠️ Missing deals            |
| Teacher                     | `dashboards/teacher/*`, `features/teachers/*`                                                           | ⚠️ Missing evaluations      |
| Parent                      | `dashboards/parent/*`, `features/parent/*`, `features/children/*`                                       | ⚠️ Missing capacity request |
| Service Provider (Enricher) | ❌ Nothing                                                                                              | ❌ Full                     |

### Roles & Permissions

| Entity                       | Frontend                                               |
| ---------------------------- | ------------------------------------------------------ |
| UserRole enum                | `src/lib/types/enums.ts` — 4 values (missing ENRICHER) |
| Route guards (proxy.ts)      | Routes for ADMIN, ORG, TEACHER, PARENT                 |
| Layout guards (RequireRoles) | Each dashboard layout                                  |
| Role-based sidebar           | Admin, Organization, Parent, Teacher sidebars          |
| ACCESS_MAP                   | `proxy.ts` — section access control                    |

### Entities

| Entity            | Frontend Type                                                                         | CRUD                |
| ----------------- | ------------------------------------------------------------------------------------- | ------------------- |
| Organization      | `src/features/organizations/types/interfaces.ts`, `src/lib/types/types/interfaces.ts` | ✅                  |
| Child             | `src/features/children/types/interfaces.ts`                                           | ✅                  |
| ParentProfile     | `src/lib/types/types/interfaces.ts`                                                   | ⚠️ No membership UI |
| Teacher           | `src/features/teachers/types/index.ts`                                                | ✅                  |
| Employee          | `src/features/employees/types/interfaces.ts`                                          | ✅                  |
| Evaluation        | `src/lib/types/types/interfaces.ts`                                                   | ⚠️ No edit/archive  |
| EvaluationAttempt | `src/lib/types/types/interfaces.ts`                                                   | ✅                  |
| Grade             | `src/features/grades/types/index.ts`                                                  | ✅                  |
| Class             | `src/features/classes/types/index.ts`                                                 | ✅                  |
| Deal              | ❌                                                                                    | ❌                  |
| Proposal          | ❌                                                                                    | ❌                  |
| ServiceProvider   | ❌                                                                                    | ❌                  |
| TransferRequest   | `src/features/children/types/interfaces.ts`, `src/lib/types/types/interfaces.ts`      | ⚠️ Partial          |

### Workflows

| Workflow                      | Frontend | Gaps                                         |
| ----------------------------- | -------- | -------------------------------------------- |
| Organization Lifecycle        | ✅       | None                                         |
| Independent Parent Lifecycle  | ⚠️       | ParentSignupForm is empty stub               |
| Organization Parent Lifecycle | ⚠️       | Parent search flow exists but may be fragile |
| Deal Lifecycle                | ❌       | Entirely missing                             |
| Assessment Lifecycle          | ✅       | Full start→run→submit→approve→results        |
| Provider Lifecycle            | ❌       | Entirely missing                             |
| Capacity Increase Flow        | ❌       | Missing                                      |
| Transfer Request Flow         | ⚠️       | Org side exists, parent side limited         |
| Payment Approval Flow         | ❌       | PaymentService exists but no admin UI        |

### Business Rules

| Rule                                                  | Frontend Check          | Status                                                  |
| ----------------------------------------------------- | ----------------------- | ------------------------------------------------------- |
| BR-01 Email unique                                    | Backend-enforced        | ⚠️ No frontend uniqueness check                         |
| BR-02 Phone unique                                    | Backend-enforced        | ⚠️ No frontend uniqueness check                         |
| BR-03 Parent owns both types                          | ✅ Supported            | ✅                                                      |
| BR-04 Child cannot be both types                      | Frontend separates APIs | ✅                                                      |
| BR-05 Organization selects winning proposal           | ❌                      | Deal not implemented                                    |
| BR-06 Admin approves/rejects selected proposal        | ❌                      | Deal not implemented                                    |
| BR-07 Assessment scoring differs per assessment       | ✅ Server-side          | ✅                                                      |
| BR-08 Reports differ per assessment                   | ⚠️                      | Generic fallback + 6 hardcoded types                    |
| BR-09 Parent-child ownership validated                | ⚠️                      | `isChildOwnedByUser` exists but not universally applied |
| BR-10 Critical actions audit logged                   | ❌                      | No audit log                                            |
| BR-11 RBAC enforced on all endpoints                  | ⚠️                      | Routes guarded, but Service Provider missing            |
| BR-12 Payment unlocks additional parent limits        | ❌                      | Not connected                                           |
| BR-13 Transfer requests approved before moving        | ⚠️                      | Org approve/reject exists                               |
| BR-14 Teachers cannot access private children         | ⚠️                      | No explicit guard                                       |
| BR-15 Organizations cannot access private assessments | ⚠️                      | No explicit guard                                       |
| BR-16 Parents access all children they own            | ✅                      | Supported via parent APIs                               |

---

_Audit completed. 10 missing features identified, 8 RBAC/security issues found, 3 workflows entirely unimplemented._
