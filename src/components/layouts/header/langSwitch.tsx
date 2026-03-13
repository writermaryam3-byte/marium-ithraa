'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import Image from "next/image";

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // استبدال كود اللغة في المسار الحالي
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full overflow-hidden"
          aria-label="Language"
        >
          <div className="relative size-6">
            {locale === "ar" ? (
              <Image
                src="/flags/sa.svg"
                alt="Arabic"
                fill
                className="object-cover"
                sizes="24px"
                priority
              />
            ) : (
              <Image
                src="/flags/us.svg"
                alt="English"
                fill
                className="object-cover"
                sizes="24px"
                priority
              />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale('en')}>
          <div className="flex items-center gap-2">
            <Image src="/flags/us.svg" alt="US flag" width={18} height={18} />
            English
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale('ar')}>
          <div className="flex items-center gap-2">
            <Image src="/flags/sa.svg" alt="Saudi flag" width={18} height={18} />
            العربية
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}