"use client";

import { useState } from "react";
import axios from "axios";
import { login } from "../services/auth-service";
import type { LoginResponse } from "../types/auth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await login({ email, password });

      if (res.success && res.data) {
        const token = res.data.access_token;
        localStorage.setItem("access_token", token);

        console.log("Login success, :", res.data.display_name);
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
    handleLogin,
  };
}
