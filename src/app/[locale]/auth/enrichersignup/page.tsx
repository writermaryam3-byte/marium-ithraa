"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { EnricherSignup } from "@/features/auth"


export default function EnricherSignupPage() {



  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 380px at 85% 35%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 60%), radial-gradient(780px 320px at 15% 65%, color-mix(in oklab, var(--chart-4) 18%, transparent), transparent 62%)",
        }}
      />

      <div className="app-container relative pt-36 pb-14 lg:pt-40 lg:pb-20">
        <Card className="mx-auto max-w-2xl rounded-3xl border-border/60 bg-background/80 shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">إنشاء حساب مُثرٍ</CardTitle>
            <CardDescription>املأ البيانات لإنشاء حسابك، ثم سيتم تسجيل دخولك مباشرة.</CardDescription>
          </CardHeader>
          <CardContent>
            <EnricherSignup/>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
