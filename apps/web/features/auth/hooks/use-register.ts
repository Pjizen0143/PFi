// features/auth/hooks/useRegister.ts
"use client";
import type { ValidationError } from "@/lib/types";
import { FormErrorHandler } from "@/lib/utils/error-handler";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { register } from "../services/auth-service";
import { useLocale } from "next-intl";

export function useRegister() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[] | null>(null);

  async function handleRegister(
    email: string,
    password: string,
    confirm_password: string,
    display_name: string
  ) {
    const displayNameRegex = /^[A-Za-z0-9_]+$/;

    if (!displayNameRegex.test(display_name)) {
      setError("A-Z, a-z, 0-9, and _ only for display name");
      return;
    }
    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setValidationErrors(null);

      await register({ email, password, display_name });

      await signIn("credentials", {
        email,
        password,
        callbackUrl: `/${locale}/dashboard`,
      });

    } catch (err) {
      setError(FormErrorHandler.getErrorMessage(err, "Register failed"));
      setValidationErrors(FormErrorHandler.getValidationErrors(err));
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, validationErrors, handleRegister };
}