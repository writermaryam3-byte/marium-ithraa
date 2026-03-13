
"use client"

import * as React from "react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/social-links"

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M18.901 2H22l-6.77 7.733L23.2 22h-6.24l-4.89-7.394L5.6 22H2.5l7.26-8.3L1 2h6.4l4.42 6.65L18.9 2Zm-1.09 18.14h1.72L5.47 3.76H3.63l14.18 16.38Z"
      />
    </svg>
  )
}

const Footer = ({ locale }: { locale?: string }) => {
  const activeLocale = useLocale()
  const t = useTranslations("Footer")
  const isRtl = (locale ?? activeLocale) === "ar"

  const pathsLinks = [
    { label: t("Paths.WaliAlAmr"), href: "/wali-al-amr" },
    { label: t("Paths.Landmarks"), href: "/landmarks" },
    { label: t("Paths.Partners"), href: "/partners" },
    { label: t("Paths.Foundation"), href: "/foundation" },
    { label: t("Paths.FollowFoundation"), href: "/follow" },
  ]

  const aboutLinks = [
    { label: t("About.Home"), href: "/" },
    { label: t("About.WhoWeAre"), href: "/about" },
    { label: t("About.Services"), href: "/services" },
    { label: t("About.Blog"), href: "/blog" },
    { label: t("About.Contact"), href: "/contact" },
  ]

  return (
    <footer className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[45%] opacity-60 blur-[0.5px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168, 85, 247, 0.18), transparent 70%)",
        }}
      />

      <div className="app-container relative py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo.svg"
                alt={t("Brand.Alt")}
                width={220}
                height={70}
                className="h-12 w-auto"
                priority={false}
              />
            </Link>

            <div className="mt-5 flex items-center gap-2">
              <Button asChild variant="ghost" size="icon-sm">
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("Social.YouTube")}
                >
                  <Youtube />
                </a>
              </Button>

              <Button asChild variant="ghost" size="icon-sm">
                <a
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("Social.X")}
                >
                  <XIcon className="size-4" />
                </a>
              </Button>

              <Button asChild variant="ghost" size="icon-sm">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("Social.Instagram")}
                >
                  <Instagram />
                </a>
              </Button>

              <Button asChild variant="ghost" size="icon-sm">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("Social.Facebook")}
                >
                  <Facebook />
                </a>
              </Button>
            </div>

            <div className={`mt-6 space-y-2 text-sm text-muted-foreground ${isRtl ? "text-right" : "text-left"}`}>
              <a className="block w-fit hover:text-foreground" href={`mailto:${t("Contact.Email")}`}>
                {t("Contact.Email")}
              </a>
              <a className="block w-fit hover:text-foreground" href={`tel:${t("Contact.PhoneTel")}`}>
                {t("Contact.Phone")}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className={isRtl ? "text-right" : "text-left"}>
                <h3 className="text-sm font-semibold text-foreground">{t("Paths.Title")}</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {pathsLinks.map((l) => (
                    <li key={l.href}>
                      <Link className="hover:text-foreground" href={l.href}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={isRtl ? "text-right" : "text-left"}>
                <h3 className="text-sm font-semibold text-foreground">{t("About.Title")}</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {aboutLinks.map((l) => (
                    <li key={l.href}>
                      <Link className="hover:text-foreground" href={l.href}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className={`flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between ${isRtl ? "sm:flex-row-reverse" : ""}`}>
          <div>{t("Legal.Copyright", { year: new Date().getFullYear() })}</div>
          <div className="flex items-center gap-4">
            <Link className="hover:text-foreground" href="/privacy">
              {t("Legal.Privacy")}
            </Link>
            <Link className="hover:text-foreground" href="/terms">
              {t("Legal.Terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer