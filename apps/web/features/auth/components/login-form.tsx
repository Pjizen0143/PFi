"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const t = useTranslations("signin");

  const { handleLogin, loading, error } = useLogin();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await handleLogin(email, password);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label={t("email")}
        placeholder="example@pfi.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordInput
        label={t("password")}
        value={password}
        forgotPasswordShow={true}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? t("loading") : t("submit")}
      </Button>
    </form>
  );
}
