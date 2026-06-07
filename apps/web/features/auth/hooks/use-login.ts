// features/auth/hooks/useLogin.ts
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale } from "next-intl";

export function useLogin() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(email: string, password: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) return setError("Please enter your email");
    if (!emailRegex.test(email)) return setError("Invalid email format");
    if (!password) return setError("Please enter your password");

    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    window.location.href = `/${locale}/dashboard`;
  }

  return { loading, error, handleLogin, setError };
}