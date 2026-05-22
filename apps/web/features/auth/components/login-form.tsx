"use client";

import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("signin");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("login");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label={t("email")} placeholder="example@pfi.com" />

      <PasswordInput label={t("password")} />

      <Button type="submit">{t("submit")}</Button>
    </form>
  );
}
