"use client"

import { useFormContext } from "react-hook-form"

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

const TeacherSignup = () => {

  const { control } = useFormContext()

  return (
    <div className="space-y-4">

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>اسم المعلم</FormLabel>
            <FormControl>
              <Input placeholder="اسم المعلم" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>رقم الهاتف</FormLabel>
            <FormControl>
              <Input placeholder="رقم الهاتف" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>التخصص</FormLabel>
            <FormControl>
              <Input placeholder="التخصص" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  )
}

export default TeacherSignup