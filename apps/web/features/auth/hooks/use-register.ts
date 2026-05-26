"use client";

import { useState } from "react";
import axios from "axios";
import { register } from "../services/auth-service";
import type { RegisterResponse } from "../types/auth";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRegister(email: string, password: string, confirm_password: string, display_name: string) {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (password !== confirm_password) {
        setError("Passwords do not match");
        return;
      }

      const res = await register({ email, password, display_name });

      if (res.success && res.data) {
        const token = res.data.access_token;
        const displayName = res.data.display_name;
        localStorage.setItem("access_token", token);
        localStorage.setItem("display_name", displayName);
        setSuccess(true);
        console.log("Register success, :", displayName);
      } else {
        setError(res.message || "Register failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data as RegisterResponse | undefined;
        setError(serverError?.message || serverError?.error?.code || "Register failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    success,
    handleRegister,
  };
}
