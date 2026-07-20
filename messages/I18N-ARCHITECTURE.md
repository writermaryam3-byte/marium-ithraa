# I18N Architecture Guide

## Directory Structure

```
messages/
├── en/                          # English translations
│   ├── common.json              # Globally reusable buttons, states, yesNo, general labels
│   ├── actions.json             # Reusable action labels + domain-specific CRUD messages
│   ├── navigation.json          # Header, footer, dashboard, organization nav
│   ├── metadata.json            # Page titles, SEO, OpenGraph, Twitter
│   ├── validation.json          # All generic validation messages
│   ├── errors.json              # Frontend errors (network, permission, 404, etc.)
│   ├── api-errors.json          # Backend error code translations
│   ├── auth.json                # Login, logout, session
│   ├── signup.json              # Multi-step signup wizard
│   ├── dashboard.json           # Dashboard cards, parent dashboard, chose role, admin users
│   ├── children.json            # Children CRUD, transfers, create child
│   ├── teachers.json            # Teachers CRUD, teacher dashboard
│   ├── organizations.json       # Organizations admin, grades, classes, org dashboard, org results, org evaluations
│   ├── employees.json           # Employee CRUD
│   ├── users.json               # Users admin, roles chart
│   ├── evaluations.json         # Evaluations, attempts, results, builder, session, capacity requests, tests
│   ├── deals.json               # Deals, proposals, enricher dashboard
│   ├── notifications.json       # Notifications, dispatch
│   ├── activities.json          # Activities CRUD
│   ├── landing.json             # Landing page, footer, flow CTA
│   ├── about.json               # About page
│   ├── privacy.json             # Privacy policy
│   ├── terms.json               # Terms & conditions
│   ├── verify-email.json        # Email verification flow
│   ├── dialogs.json             # Shared dialog patterns
│   ├── forms.json               # Shared form labels
│   ├── tables.json              # Shared table UI
│   ├── pagination.json          # Shared pagination
│   └── emails.json              # Email templates
├── ar/                          # Arabic translations (same structure)
│   └── (same 29 files)
├── namespaces.ts                # Namespace registry, type definitions
├── loader.ts                    # Dynamic import loader
└── index.ts                     # Public exports
```

## Namespace Categories

### Shared Namespaces (Global)
| Namespace | Purpose | Example Keys |
|-----------|---------|--------------|
| `common` | Buttons, states, yesNo, general labels | `common.buttons.save`, `common.states.loading` |
| `actions` | CRUD action labels per domain | `actions.common.deleted`, `actions.children.created` |
| `validation` | Generic validation messages | `validation.required`, `validation.email.invalid` |
| `errors` | Frontend error messages | `errors.network`, `errors.pageNotFound` |
| `api-errors` | Backend error code translations | `apiErrors.childCreated`, `apiErrors.sessionExpired` |

### UI Namespaces (Shared Components)
| Namespace | Purpose | Example Keys |
|-----------|---------|--------------|
| `navigation` | Header, footer, dashboard, org nav | `navigation.dashboard.children` |
| `metadata` | Page titles, SEO, OpenGraph | `metadata.pages.home.title` |
| `dialogs` | Shared dialog patterns | `dialogs.confirmDelete.title` |
| `forms` | Shared form labels | `forms.login.phone.label` |
| `tables` | Shared table UI | `tables.search`, `tables.rowsPerPage` |
| `pagination` | Shared pagination | `pagination.previous`, `pagination.next` |
| `emails` | Email templates | `emails.verification.title` |

### Feature Namespaces (Business Domains)
| Namespace | Purpose | Example Keys |
|-----------|---------|--------------|
| `children` | Children management | `children.title`, `children.fields.name` |
| `teachers` | Teachers management | `teachers.title`, `teachers.dashboard.welcome` |
| `organizations` | Organizations admin, grades, classes | `organizations.admin.title`, `organizations.grades.title` |
| `employees` | Employee management | `employees.title`, `employees.forms.name` |
| `users` | Users admin | `users.title`, `users.rolesChart.title` |
| `evaluations` | Evaluations, attempts, results | `evaluations.title`, `evaluations.types.multipleIntelligences` |
| `deals` | Deals, proposals, enricher dashboard | `deals.title`, `deals.enricher.welcome` |
| `notifications` | Notifications, dispatch | `notifications.title`, `notifications.dispatchTitle` |
| `activities` | Activities management | `activities.title`, `activities.fields.name` |

### Page Namespaces
| Namespace | Purpose | Example Keys |
|-----------|---------|--------------|
| `landing` | Landing page, footer, flow CTA | `landing.hero.title`, `landing.footer.legal.copyright` |
| `about` | About page | `about.badge`, `about.vision.title` |
| `privacy` | Privacy policy | `privacy.headerTitle`, `privacy.sections.definitions` |
| `terms` | Terms & conditions | `terms.title` |
| `verify-email` | Email verification flow | `verify-email.title`, `verify-email.sentLink` |
| `signup` | Multi-step signup wizard | `signup.beneficiary.wizard.next` |
| `auth` | Login, logout, session | `auth.login.title`, `auth.login.errors.invalidCredentials` |
| `dashboard` | Dashboard cards, parent dashboard | `dashboard.titles.dashboard`, `dashboard.parent.welcome` |

## Naming Conventions

### Keys
- **camelCase** for all keys: `childName`, `birthDate`, `organizationType`
- **No PascalCase**: `Dashboard` ❌ → `dashboard` ✅
- **No snake_case**: `organization_name` ❌ → `organizationName` ✅
- **No kebab-case for keys**: `verify-email` is a file name, not a key

### File Names
- **kebab-case** for file names: `api-errors.json`, `verify-email.json`
- **camelCase** for namespace keys: `apiErrors`, `verifyEmail`

### Placeholders
- **Curly braces** with camelCase: `{name}`, `{count}`, `{date}`, `{email}`
- **Consistent naming**: `{organizationName}`, `{childName}`, `{teacherName}`

## Feature File Structure

Every feature file follows this schema:

```json
{
  "title": "Feature Title",
  "description": "Feature description",
  "page": { "title": "Page title" },
  "actions": { "add": "Add item" },
  "fields": { "name": "Name", "email": "Email" },
  "filters": { "searchPlaceholder": "Search…" },
  "dialogs": { "addTitle": "Add", "deleteTitle": "Delete" },
  "table": { "columns": { "name": "Name" } },
  "status": { "active": "Active", "inactive": "Inactive" },
  "messages": { "empty": "No data" },
  "validation": { "required": "Required" },
  "breadcrumbs": { "home": "Home" },
  "statistics": {},
  "emptyStates": { "list": "No items" },
  "forms": { "name": { "label": "Name", "placeholder": "Enter name" } }
}
```

**Only include keys that have values.** Remove empty objects.

## Usage Examples

### Client Component
```tsx
'use client'
import { useTranslations } from 'next-intl'

const ChildForm = () => {
  const t = useTranslations('children')
  const tCommon = useTranslations('common')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <label>{t('fields.name')}</label>
      <button>{tCommon('buttons.save')}</button>
    </div>
  )
}
```

### Server Component
```tsx
import { getTranslations } from 'next-intl/server'

export default async function Page({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  
  return { title: t('pages.home.title') }
}
```

### Backend Error Translation
```tsx
import { useTranslateBackend } from '@/lib/i18n/backend-messages'

const ErrorHandler = ({ error }) => {
  const translate = useTranslateBackend()
  return <p>{translate(error.message)}</p>
}
```

## Migration Checklist

When migrating a component from old keys to new:

1. Find the old key in `scripts/i18n-namespace-map.json`
2. Replace `useTranslations('OldKey')` with `useTranslations('newNamespace')`
3. Update all `t('oldKey')` calls to use new key paths
4. Verify the translation exists in the new namespace
5. Run the build to catch missing keys

## Contribution Rules

### Adding a New Feature

1. Create `messages/en/new-feature.json` with the standard structure
2. Create `messages/ar/new-feature.json` with Arabic translations
3. Add `'new-feature'` to `namespaceFiles` array in `namespaces.ts`
4. Add `newFeature: 'new-feature'` mapping in `namespaceKeys`
5. Add the import case in `loader.ts`
6. Use `useTranslations('newFeature')` in components

### Adding a Translation Key

1. Determine the correct namespace (feature, shared, or page)
2. Add the key in both EN and AR files
3. Use camelCase for the key name
4. Use consistent placeholders: `{name}`, `{count}`, etc.
5. Never duplicate a key that exists in a shared namespace

### What Belongs Where

| Translation Type | Namespace |
|-----------------|-----------|
| Save/Cancel/Delete buttons | `common` |
| Feature-specific CRUD messages | `actions.{feature}` |
| Form field labels (shared) | `forms` |
| Form field labels (feature-specific) | `{feature}.forms` |
| Validation messages (generic) | `validation` |
| Validation messages (feature-specific) | `{feature}.validation` |
| Frontend errors | `errors` |
| Backend error codes | `api-errors` |
| Navigation labels | `navigation` |
| Page titles/SEO | `metadata` |
| Dialog patterns | `dialogs` |
| Table UI | `tables` |
| Pagination | `pagination` |
| Email templates | `emails` |
| Page content (landing, about, etc.) | `{page}` |
| Feature content | `{feature}` |

## Anti-Patterns

### Never Do These

```tsx
// ❌ Don't mix namespaces
const t = useTranslations('Dashboard.Children')
t('common.cancel') // This is wrong

// ✅ Use separate namespaces
const t = useTranslations('children')
const tActions = useTranslations('common')
tActions('buttons.cancel')

// ❌ Don't use PascalCase keys
{ "Title": "Hello" }

// ✅ Use camelCase
{ "title": "Hello" }

// ❌ Don't duplicate shared translations
// In children.json:
{ "cancel": "Cancel" } // Already in common.json

// ✅ Reference shared translations
tCommon('buttons.cancel')

// ❌ Don't put feature translations in common
// In common.json:
{ "childName": "Child name" }

// ✅ Keep feature translations in feature file
// In children.json:
{ "fields": { "name": "Name" } }

// ❌ Don't use inconsistent placeholders
{ "Hello {Name}" } // Capital N
{ "Hello {name}" } // lowercase n

// ✅ Use consistent placeholders
{ "Hello {name}" } // Always camelCase
```

## Production Checklist

- [ ] All translation keys use camelCase
- [ ] No duplicate keys across namespaces
- [ ] All placeholders use `{camelCase}` format
- [ ] Both EN and AR files have identical key structures
- [ ] No empty objects in namespace files
- [ ] Feature translations are in feature namespaces
- [ ] Shared translations are in shared namespaces
- [ ] Backend error codes match `api-errors.json` keys
- [ ] All `useTranslations()` calls use correct namespace
- [ ] Build passes without missing key warnings
