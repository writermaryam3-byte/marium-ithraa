"use client"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { IconBrandGmail, IconBrandMinecraft } from "@tabler/icons-react"
import { sendVerficationEmail } from "@/features/mailer"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export default function EmailVerificationPage() {
    const { data: session, status } = useSession()

    const email = session?.user?.email
    const userId = session?.user?.id

    const [sending, setSending] = useState(false)
    const [sended, setSended] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    const sendEmail = useCallback(async () => {
        if (!email || !userId) return

        try {
            setSending(true)
            await sendVerficationEmail({ email, userId })
            setSended(true)
            setCooldown(60) // 60 ثانية
        } catch (error) {
            console.error(error)
            toast.error("Failed to send email")
        } finally {
            setSending(false)
        }
    }, [email, userId])

    // إرسال أول مرة تلقائي
    useEffect(() => {
        if (status === "authenticated" && email && userId && !sended) {
            void sendEmail()
        }
    }, [status, email, userId, sended, sendEmail])

    // toast مرة واحدة
    useEffect(() => {
        if (sended) {
            toast.success("Email sent successfully")
        }
    }, [sended])

    // countdown للـ cooldown
    useEffect(() => {
        if (cooldown <= 0) return

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [cooldown])

    return (
        <main className="min-h-dvh pt-36 pb-16">
            <div className="app-container">
                <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
                    <Card className="mx-auto w-full max-w-md border-amber-50 shadow-md">
                        <CardHeader className="space-y-2">
                            <div className="flex items-center justify-center">
                                <Image
                                    src="/logo.svg"
                                    alt="logo"
                                    width={160}
                                    height={48}
                                    className="h-10 w-auto"
                                    priority
                                />
                            </div>
                            <CardTitle className="text-center text-2xl font-bold text-blue-500">
                                Check your email
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>
                                    We sent a verification link to{" "}
                                    <span className="font-medium text-foreground">
                                        {email || "your email"}
                                    </span>
                                </p>
                                <p>
                                    Open the email and click the link to verify your account.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <Button asChild variant="secondary" className="h-11 rounded-xl">
                                    <a href="https://mail.google.com/" target="_blank">
                                        <IconBrandGmail />
                                        Open Gmail
                                    </a>
                                </Button>

                                <Button asChild variant="secondary" className="h-11 rounded-xl">
                                    <a href="https://outlook.live.com/mail/" target="_blank">
                                        <IconBrandMinecraft />
                                        Open Outlook
                                    </a>
                                </Button>
                            </div>

                            <Button
                                asChild
                                className="h-11 w-full rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-95"
                            >
                                <Link href={`/auth/login`}>Back to login</Link>
                            </Button>

                            <Button
                                onClick={sendEmail}
                                disabled={sending || cooldown > 0}
                                className="h-11 w-full rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-95"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Sending...
                                    </>
                                ) : cooldown > 0 ? (
                                    `Resend in ${cooldown}s`
                                ) : (
                                    "Resend Email"
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="hidden lg:block">
                        <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
                            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/20" />
                            <div className="relative p-10">
                                <Image
                                    src="/hero.svg"
                                    alt="hero"
                                    width={520}
                                    height={520}
                                    className="h-auto w-full"
                                    priority
                                />
                                <p className="mt-6 text-lg font-semibold text-foreground">
                                    You’re almost done
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Click the verification link from your inbox to activate your account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}