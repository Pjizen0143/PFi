"use client";

import type { ValidationError } from "@/lib/types";
import { FormErrorHandler } from "@/lib/utils/error-handler";
import { useState } from "react";
import { login } from "../services/auth-service";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[] | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleLogin(email: string, password: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
      setLoading(true);
      setError(null);
      setValidationErrors(null);
      setSuccess(false);

      // --- [Client-side Validation] ---
      if (!email.trim()) {
        setError("Please enter your email");
        return;
      }

      if (!emailRegex.test(email)) {
        setError("Invalid email format");
        return;
      }

      if (!password) {
        setError("Please enter your password");
        return;
      }

      const res = await login({ email, password });

      // --- [Server-side Success] ---
      if (res.data) {
        const token = res.data.access_token;
        const displayName = res.data.display_name;
        
        localStorage.setItem("access_token", token);
        localStorage.setItem("display_name", displayName);

        setSuccess(true);
        console.log("Login success, welcome:", displayName);
      } else {
        setError("Login failed: Unexpected response from server");
      }
    } catch (err) {
      // --- [Server-side Error Handling using Utility] ---
      setError(FormErrorHandler.getErrorMessage(err, "Login failed"));
      setValidationErrors(FormErrorHandler.getValidationErrors(err));
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    validationErrors,
    success,
    handleLogin,
    setError,
  };
}