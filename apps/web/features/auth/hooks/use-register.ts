"use client";

import type { ValidationError } from "@/lib/types";
import { FormErrorHandler } from "@/lib/utils/error-handler";
import { useState } from "react";
import { register } from "../services/auth-service";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[] | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRegister(
    email: string, 
    password: string, 
    confirm_password: string, 
    display_name: string
  ) {
    const displayNameRegex = /^[A-Za-z0-9_]+$/;

    try {
      setLoading(true);
      setError(null);
      setValidationErrors(null);
      setSuccess(false);

      // Check if display name matches the allowed pattern
      if (!displayNameRegex.test(display_name)) {
        setError("A-Z, a-z, 0-9, and _ only for display name");
        return;
      }

      if (password !== confirm_password) {
        setError("Passwords do not match");
        return;
      }

      const res = await register({ email, password, display_name });

      // --- [Server-side Success] ---
      if (res.data) {
        const token = res.data.access_token;
        const displayName = res.data.display_name;
        
        localStorage.setItem("access_token", token);
        localStorage.setItem("display_name", displayName);
        
        setSuccess(true);
      } else {
        setError("Register failed: Unknown response structure");
      }
    } catch (err) {
      // --- [Server-side Error Handling using Utility] ---
      setError(FormErrorHandler.getErrorMessage(err, "Register failed"));
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
    handleRegister,
  };
}