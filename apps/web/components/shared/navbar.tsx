"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ProfileIcon } from "./profile-icon";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";

export function Navbar() {
  const t = useTranslations("navbar");
  const { status } = useSession();

  return (
    <header className="border-foreground/10 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* LEFT */}
        <Logo />

        {/* CENTER */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-foreground/70 hover:text-primary text-sm transition">
            {t("features")}
          </Link>
          <Link href="#about" className="text-foreground/70 hover:text-primary text-sm transition">
            {t("about")}
          </Link>
          <Link href="#contact" className="text-foreground/70 hover:text-primary text-sm transition">
            {t("contact")}
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <ThemeToggle />

          {status === "authenticated" ? (
            <ProfileIcon />
          ) : (
            <Link
              href="/signin"
              className="bg-primary text-background hidden rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90 md:inline-block"
            >
              {t("signin")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

