
import Image from "next/image";
import { useTranslations } from "next-intl";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/pages/login/LoginForm";



export default function LoginPage() {
    const t = useTranslations("Auth.Login");


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
                                {t("title")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LoginForm />
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
                                    {t("side.title")}
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t("side.subtitle")}
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </main>
    );
}