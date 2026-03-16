"use client"
import FormFields from '@/components/shared/forms/formFields'
import { Button } from '@/components/ui/button'
import useFormFields from '@/hooks/useFormFields'
import { signInWithPhoneAndRedirect } from '@/lib/auth/signInWithCredentials'
import { FormTypes } from '@/lib/types/enums'
import { Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { SyntheticEvent, useRef, useState } from 'react'


const LoginForm = () => {
    const t = useTranslations("Auth.Login");

    const locale = useLocale();
    const router = useRouter();
    const { getFormFields } = useFormFields({ slug: FormTypes.SIGNIN });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false)
    const form = useRef<HTMLFormElement>(null)


    const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.current) return;
        setError(null);
        setIsSubmitting(true);
        const formData = new FormData(form.current);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });


        try {
            const res = await signInWithPhoneAndRedirect({
                phone: data.phone.trim(),
                password: data.password,
                push: router.push,
            });
            console.log(res,"as res")
            if (!res.ok) {
                setError(t("errors.invalidCredentials"));
            }
        } catch {
            setError(t("errors.unexpected"));
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={onSubmit} ref={form} className="space-y-6">
            <div className="space-y-4">
                {getFormFields().map((f) => (
                    <FormFields key={f.name} {...f} error={{}} />
                ))}
            </div>

            <div className="flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 rounded border-input"
                    />
                    {t("rememberMe")}
                </label>
                <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={() => router.push(`/${locale}/auth/forgot-password`)}
                >
                    {t("forgotPassword")}
                </Button>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-95"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("submitting")}
                    </>
                ) : (
                    t("submit")
                )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                {t("noAccount")}{" "}
                <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => router.push(`/${locale}/auth/Beneficiarysignup`)}
                >
                    {t("createAccount")}
                </Button>
            </div>
        </form>
    )
}

export default LoginForm