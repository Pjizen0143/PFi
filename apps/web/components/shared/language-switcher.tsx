"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function LanguageSwitcher() {
  const pathname = usePathname();

  const switchLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;

    return segments.join("/");
  };

  return (
    <div className="flex gap-2">
      <Link href={switchLocale("en")}>
        EN
      </Link>

      <Link href={switchLocale("th")}>
        TH
      </Link>
    </div>
  );
}