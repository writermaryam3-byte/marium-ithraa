import { FormTypes } from '@/lib/types/enums'

import {
  childAdminFormConfig,
  childOrgFormConfig,
  childPrivateFormConfig,
  childUpdateFormConfig,
} from './child.config'
import { classFormConfig } from './class.config'
import { employeeFormConfig } from './employee.config'
import { employeeUpdateFormConfig } from './employee-update.config'
import { gradeFormConfig } from './grade.config'
import { loginFormConfig } from './login.config'
import { teacherFormConfig } from './teacher.config'
import { testFormConfig } from './test.config'
import type { FormRegistryEntry } from '../types'

export const formRegistry: Partial<Record<FormTypes, FormRegistryEntry>> = {
  [FormTypes.SIGNIN]: loginFormConfig,
  [FormTypes.EMPLOYEE]: employeeFormConfig,
  [FormTypes.EMPLOYEE_UPDATE]: employeeUpdateFormConfig,
  [FormTypes.TEACHER]: teacherFormConfig,
  [FormTypes.GRADE]: gradeFormConfig,
  [FormTypes.CLASS]: classFormConfig,
  [FormTypes.CHILD_ORG]: childOrgFormConfig,
  [FormTypes.CHILD_UPDATE]: childUpdateFormConfig,
  [FormTypes.CHILD_PRIVATE]: childPrivateFormConfig,
  [FormTypes.CHILD_ADMIN]: childAdminFormConfig,
  [FormTypes.TEST]: testFormConfig,
}

export {
  loginFormConfig,
  employeeFormConfig,
  employeeUpdateFormConfig,
  teacherFormConfig,
  gradeFormConfig,
  classFormConfig,
  childOrgFormConfig,
  childUpdateFormConfig,
  childPrivateFormConfig,
  testFormConfig,
}
