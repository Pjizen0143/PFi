"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRegister } from "../hooks/use-register";

export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { loading, error, success, handleRegister } = useRegister();

  useEffect(() => {
    if (success) {
      router.push("/");
    }
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleRegister(email, password, confirmPassword, name);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label={t("username")}
        placeholder="MyName123"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        required
      />

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
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />

      <PasswordInput
        label={t("confirm_password")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
        required
      />

      <div className="flex items-start gap-3 select-none">
        <input
          id="terms"
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          disabled={loading}
          className="text-primary focus:ring-primary/50 mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 disabled:opacity-50"
        />
        <label htmlFor="terms" className="text-muted-foreground cursor-pointer text-sm leading-relaxed">
          {t.rich("demo_warning", {
            demo_version: (chunks) => (
              <span className="text-destructive text-primary font-semibold hover:underline">{chunks}</span>
            ),
          })}
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading || !agreeTerms} className="w-full">
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
