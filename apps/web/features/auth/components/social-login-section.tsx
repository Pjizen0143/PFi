"use client";
import { signIn } from "next-auth/react";
import { SocialButton } from "@/components/ui/social-button";
import { useLocale } from "next-intl";

export function SocialLoginSection() {
  const locale = useLocale();

  return (
    <div className="flex gap-4">
      <SocialButton onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard` })}>Google</SocialButton>
    </div>
  );
}
