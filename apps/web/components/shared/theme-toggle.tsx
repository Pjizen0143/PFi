"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@teispace/next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border-foreground/10 bg-card hover:border-primary/30 text-foreground flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon size={20} className="animate-in fade-in zoom-in-75 duration-300" />
      ) : (
        <Sun size={20} className="animate-in fade-in zoom-in-75 duration-300" />
      )}
    </button>
  );
}
