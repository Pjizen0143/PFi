"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

type PasswordInputProps = {
  label: string;
};

export function PasswordInput({ label }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const t = useTranslations("signin");

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="font-medium">{label}</label>

        <button type="button" className="text-primary font-semibold hover:cursor-pointer hover:opacity-80">
          {t("forgot_password")}
        </button>
      </div>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="bg-background border-foreground/10 focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-4 outline-none focus:ring-2"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-foreground/60 absolute top-1/2 right-4 -translate-y-1/2 hover:cursor-pointer"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
