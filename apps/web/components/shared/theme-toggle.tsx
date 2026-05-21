"use client";

import { useTheme } from "@teispace/next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button className="cursor-pointer"
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
    >
      Toggle Theme
    </button>
  );
}