"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import useFormFields from "@/hooks/useFormFields";
import { FormTypes } from "@/lib/types/enums";
import type { IFormField } from "@/lib/types/interfaces";
import { signInWithPhoneAndRedirect } from "@/lib/auth/signInWithCredentials";
import { useRouter } from "@/i18n/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginValues = {
  phone: string;
  password: string;
  remember: boolean;
};

const INITIAL_VALUES: LoginValues = {
  phone: "",
  password: "",
  remember: true,
};

export default function LoginPage() {
  const t = useTranslations("Auth.Login");
  const locale = useLocale();
  const router = useRouter();
  const { getFormFields } = useFormFields({ slug: FormTypes.SIGNIN });
  const fields = useMemo(() => getFormFields(), [getFormFields]);

  const [values, setValues] = useState<LoginValues>(INITIAL_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange =
    (name: keyof LoginValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => {
        if (name === "remember") {
          return { ...prev, remember: e.target.checked };
        }

        return { ...prev, [name]: e.target.value };
      });
    };

  const renderField = (field: IFormField) => {
    if (field.name === "password") {
      return (
        <div key={field.name} className="space-y-2">
          {field.label && (
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </Label>
          )}
          <div className="relative">
            <Input
              id={field.name}
              name={field.name}
              type={showPassword ? "text" : "password"}
              placeholder={field.placeholder}
              value={values.password}
              onChange={onChange("password")}
              autoFocus={field.autoFocus}
              autoComplete="current-password"
              className="pe-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 inset-e-2 inline-flex items-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? t("a11y.hidePassword") : t("a11y.showPassword")}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      );
    }

    if (field.name === "phone") {
      return (
        <div key={field.name} className="space-y-2">
          {field.label && (
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </Label>
          )}
          <Input
            id={field.name}
            name={field.name}
            type="tel"
            dir="ltr"
            placeholder={field.placeholder}
            value={values.phone}
            onChange={onChange("phone")}
            autoFocus={field.autoFocus}
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
      );
    }

    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await signInWithPhoneAndRedirect({
        phone: values.phone.trim(),
        password: values.password,
        push: router.push,
      });

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
    <main className="min-h-dvh pt-36 pb-16">
      <div className="app-container">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
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
                  {t("side.title")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("side.subtitle")}
                </p>
              </div>
            </div>
          </div>

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
                {t("title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                  {fields.map((f) => renderField(f))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={values.remember}
                      onChange={onChange("remember")}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}