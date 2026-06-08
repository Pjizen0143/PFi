"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ProfileIcon } from "./profile-icon";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";

export function MainNavbar() {
  const t = useTranslations("navbar");
  const { status } = useSession();

  return (
    <header className="border-foreground/10 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* LEFT */}
        <Logo />

        {/* CENTER */}
        <nav className="hidden items-center gap-8 md:flex"></nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <ThemeToggle />

          {status === "authenticated" && <ProfileIcon />}
        </div>
      </div>
    </header>
  );
}

