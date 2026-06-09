"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Wallet, ArrowLeftRight, User, LogOut, X } from "lucide-react";
import { Logo } from "./logo";

interface SidebarProps {
  className?: string;
  mobileOpen?: boolean;
  desktopOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ className = "", mobileOpen = false, desktopOpen = true, onCloseMobile }: SidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const menuItems = [
    {
      name: "Dashboard",
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Wallets",
      href: `/${locale}/wallets`,
      icon: Wallet,
    },
    {
      name: "Transactions",
      href: `/${locale}/transactions`,
      icon: ArrowLeftRight,
    },
  ];

  const resolvedName = session?.displayName || session?.user?.name;
  const resolvedEmail = session?.user?.email;
  const resolvedImageUrl = session?.user?.image;
  const firstChar = resolvedName?.trim().charAt(0).toUpperCase();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Show Logo & Close button only on mobile */}
        <div className="border-foreground/5 flex h-16 shrink-0 items-center justify-between border-b px-6 md:hidden">
          <Logo />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="text-foreground/50 hover:bg-foreground/5 hover:text-foreground ml-auto rounded-lg p-1.5 hover:cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="text-foreground/40 mb-3 px-3 text-xs font-semibold tracking-wider uppercase select-none">
            Navigation
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (mobileOpen && onCloseMobile) {
                      onCloseMobile();
                    }
                  }}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:cursor-pointer ${
                    isActive
                      ? "bg-primary/5 dark:bg-brand-green/10 text-primary dark:text-brand-green"
                      : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="bg-primary dark:bg-brand-green absolute top-2 bottom-2 left-0 w-1 rounded-r-full" />
                  )}

                  <Icon
                    size={18}
                    className={
                      isActive ? "text-primary dark:text-brand-green" : "text-foreground/55 group-hover:text-foreground"
                    }
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User profile section */}
      {status === "authenticated" && (
        <div className="border-foreground/5 bg-card/50 shrink-0 border-t p-4">
          <div className="flex items-center gap-3">
            <div className="bg-foreground/5 border-foreground/10 relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
              {resolvedImageUrl ? (
                <Image
                  src={resolvedImageUrl}
                  alt={resolvedName || "Profile"}
                  width={40}
                  height={40}
                  className="aspect-square h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : firstChar ? (
                <span className="text-foreground text-sm font-semibold select-none">{firstChar}</span>
              ) : (
                <User size={18} className="text-foreground/60" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm leading-none font-semibold">{resolvedName || "User"}</p>
              <p className="text-foreground/45 mt-1.5 truncate text-xs leading-none font-medium">
                {resolvedEmail || ""}
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-foreground/50 hover:bg-danger/10 hover:text-danger shrink-0 rounded-xl p-2 transition-colors hover:cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile backdrop - z-40 (below sidebar z-50) */}
      {mobileOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`border-foreground/10 bg-card fixed top-0 bottom-0 w-64 flex-col border-r md:top-16 ${className} ${mobileOpen ? "left-0 z-50 flex" : "-left-64 z-50 flex md:left-0"} ${desktopOpen ? "md:z-30 md:translate-x-0" : "md:z-30 md:-translate-x-full"} `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
