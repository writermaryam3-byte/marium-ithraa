import { FormTypes } from '@/lib/types/enums'

import { childPrivateFormConfig, childUpdateFormConfig } from './child.config'
import { classFormConfig } from './class.config'
import { classUpdateFormConfig } from './class-update.config'
import { employeeFormConfig } from './employee.config'
import { employeeUpdateFormConfig } from './employee-update.config'
import { gradeFormConfig } from './grade.config'
import { gradeUpdateFormConfig } from './grade-update.config'
import { loginFormConfig } from './login.config'
import { teacherFormConfig } from './teacher.config'
import { teacherUpdateFormConfig } from './teacher-update.config'
import { testFormConfig } from './test.config'
import type { FormRegistryEntry } from '../types'

export const formRegistry: Partial<Record<FormTypes, FormRegistryEntry>> = {
  [FormTypes.SIGNIN]: loginFormConfig,
  [FormTypes.EMPLOYEE]: employeeFormConfig,
  [FormTypes.EMPLOYEE_UPDATE]: employeeUpdateFormConfig,
  [FormTypes.TEACHER]: teacherFormConfig,
  [FormTypes.TEACHER_UPDATE]: teacherUpdateFormConfig,
  [FormTypes.GRADE]: gradeFormConfig,
  [FormTypes.GRADE_UPDATE]: gradeUpdateFormConfig,
  [FormTypes.CLASS]: classFormConfig,
  [FormTypes.CLASS_UPDATE]: classUpdateFormConfig,
  [FormTypes.CHILD_UPDATE]: childUpdateFormConfig,
  [FormTypes.CHILD_PRIVATE]: childPrivateFormConfig,
  [FormTypes.TEST]: testFormConfig,
}

export {
  loginFormConfig,
  employeeFormConfig,
  employeeUpdateFormConfig,
  teacherFormConfig,
  teacherUpdateFormConfig,
  gradeFormConfig,
  gradeUpdateFormConfig,
  classFormConfig,
  classUpdateFormConfig,
  childUpdateFormConfig,
  childPrivateFormConfig,
  testFormConfig,
}
