import { Gender, InputTypes } from '@/lib/types/enums'

import {
  createAdminChildSchema,
  createOrgChildSchema,
  createPrivateChildSchema,
  updateChildSchema,
} from '../schemas/child.schema'
import type { FormRegistryEntry } from '../types'

export const childOrgFormConfig: FormRegistryEntry<typeof createOrgChildSchema> = {
  schema: createOrgChildSchema,
  defaultValues: {
    organizationId: '',
    name: '',
    birthDate: '',
    gender: Gender.MALE,
    classId: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    parentPassword: '',
  },
  fields: [
    {
      name: 'name',
      type: InputTypes.TEXT,
      labelKey: 'Child.name.label',
      placeholderKey: 'Child.name.placeholder',
      autoFocus: true,
    },
    { name: 'birthDate', type: InputTypes.DATE, labelKey: 'Child.birthDate.label' },
    { name: 'parentName', type: InputTypes.TEXT, labelKey: 'Child.parentName.label' },
    { name: 'parentEmail', type: InputTypes.EMAIL, labelKey: 'Child.parentEmail.label' },
    { name: 'parentPhone', type: InputTypes.TEL, labelKey: 'Child.parentPhone.label' },
    { name: 'parentPassword', type: InputTypes.PASSWORD, labelKey: 'Child.parentPassword.label' },
  ],
}

export const childUpdateFormConfig: FormRegistryEntry<typeof updateChildSchema> = {
  schema: updateChildSchema,
  defaultValues: { id: '', name: '', birthDate: '', gender: Gender.MALE },
  fields: [
    { name: 'name', type: InputTypes.TEXT, labelKey: 'Child.name.label', autoFocus: true },
    { name: 'birthDate', type: InputTypes.DATE, labelKey: 'Child.birthDate.label' },
  ],
}

export const childAdminFormConfig: FormRegistryEntry<typeof createAdminChildSchema> = {
  schema: createAdminChildSchema,
  defaultValues: {
    user_id: '',
    name: '',
    grade: '',
    birthDate: '',
    gender: Gender.MALE,
  },
  fields: [
    { name: 'name', type: InputTypes.TEXT, labelKey: 'Child.name.label', autoFocus: true },
    {
      name: 'grade',
      type: InputTypes.TEXT,
      labelKey: 'Child.grade.label',
      placeholderKey: 'Child.grade.placeholder',
    },
    { name: 'birthDate', type: InputTypes.DATE, labelKey: 'Child.birthDate.label' },
  ],
}

export const childPrivateFormConfig: FormRegistryEntry<typeof createPrivateChildSchema> = {
  schema: createPrivateChildSchema,
  defaultValues: { name: '', birthDate: '', gender: Gender.MALE, currentCount: 0 },
  fields: [
    { name: 'name', type: InputTypes.TEXT, labelKey: 'Child.name.label', autoFocus: true },
    { name: 'birthDate', type: InputTypes.DATE, labelKey: 'Child.birthDate.label' },
  ],
}
