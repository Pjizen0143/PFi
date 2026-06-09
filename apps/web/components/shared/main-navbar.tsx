"use client";

import { useSession } from "next-auth/react";
import { ProfileIcon } from "./profile-icon";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";
import { Menu } from "lucide-react";

interface MainNavbarProps {
  onMenuClick: () => void;
}

export function MainNavbar({ onMenuClick }: MainNavbarProps) {
  const t = useTranslations("navbar");
  const { status } = useSession();

  return (
    <header className="border-foreground/10 bg-background/80 fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-foreground/70 hover:bg-foreground/5 hover:text-foreground rounded-lg p-2 transition-colors hover:cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <Logo />
        </div>

        {/* Center: Navigation (empty, ready for future) */}
        <nav className="hidden items-center gap-8 md:flex"></nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {status === "authenticated" && <ProfileIcon />}
        </div>
      </div>
    </header>
  );
}
