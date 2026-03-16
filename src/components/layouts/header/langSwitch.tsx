'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import "flag-icons/css/flag-icons.min.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              <span className="fi fi-sa"></span>
            ) : (
              <span className="fi fi-us"></span>

            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale('en')}>
          <div className="flex items-center gap-2">
          <span className="fi fi-us w-[18px] h-[18px]"></span>
            English
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale('ar')}>
          <div className="flex items-center gap-2">
          <span className="fi fi-sa w-[18px] h-[18px]"></span>
          العربية
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}