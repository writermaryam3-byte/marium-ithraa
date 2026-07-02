import { InputTypes } from '@/lib/types/enums'

import { createTestDefaultValues, createTestSchema } from '../schemas/test.schema'
import type { FormRegistryEntry } from '../types'

export const testFormConfig: FormRegistryEntry<typeof createTestSchema> = {
  schema: createTestSchema,
  defaultValues: createTestDefaultValues,
  fields: [
    {
      name: 'title',
      type: InputTypes.TEXT,
      labelKey: 'Test.title.label',
      placeholderKey: 'Test.title.placeholder',
      autoFocus: true,
    },
    {
      name: 'description',
      type: InputTypes.TEXT,
      labelKey: 'Test.description.label',
      placeholderKey: 'Test.description.placeholder',
    },
  ],
}
