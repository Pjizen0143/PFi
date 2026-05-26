"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const t = useTranslations("signin");
  const router = useRouter();

  const { handleLogin, loading, error, success, setError } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Clear error message when user starts typing
  useEffect(() => {
    if (error) setError(null);
  }, [email, password]);

  useEffect(() => {
    if (success) {
      router.push("/");
    }
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleLogin(email, password);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label={t("email")}
        placeholder="example@pfi.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
      />

      <PasswordInput
        label={t("password")}
        value={password}
        forgotPasswordShow={true}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{t("loading")}</span>
          </div>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
