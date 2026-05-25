"use client";

import { useState } from "react";
import axios from "axios";
import { login } from "../services/auth-service";
import type { LoginResponse } from "../types/auth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleLogin(email: string, password: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

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

      if (res.success && res.data) {
        const token = res.data.access_token;
        const displayName = res.data.display_name;
        localStorage.setItem("access_token", token);
        localStorage.setItem("display_name", displayName);

        setSuccess(true);
        console.log("Login success, :", displayName);
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data as LoginResponse | undefined;
        setError(serverError?.message || serverError?.error?.code || "Login failed");
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
    handleLogin,
    setError,
  };
}
