"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();

  const currentLocale = pathname.split("/")[1] || "en";

  const switchLocale = (locale: string) => {
    const segments = pathname.split("/");

    segments[1] = locale;

    return segments.join("/");
  };

  return (
    <div className="border-foreground/10 bg-card flex items-center rounded-full border p-1">
      {["en", "th"].map((locale) => {
        const active = currentLocale === locale;

        return (
          <Link
            key={locale}
            href={switchLocale(locale)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active ? "bg-primary text-background" : "text-foreground/60 hover:text-foreground"
            } `}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
