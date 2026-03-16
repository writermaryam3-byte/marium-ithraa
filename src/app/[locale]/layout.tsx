import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Cairo } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import SessionProvider from "@/components/providers/SessionProvider";
import { ToastContainer } from "react-toastify";
import { Providers } from "@/components/providers/QueryClientProvider";

export const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
});



export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description')
  };
}


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${cairo.variable} antialiased`}
        suppressHydrationWarning
      >


        <NextIntlClientProvider>
          <Providers>
            <SessionProvider>
              <TooltipProvider>
                <ToastContainer
                  position="top-center"
                  autoClose={2500}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={dir === "rtl"}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover={true}
                  theme="light"
                />
                {children}
              </TooltipProvider>
            </SessionProvider>
          </Providers>

        </NextIntlClientProvider>

      </body>
    </html>
  );
}
