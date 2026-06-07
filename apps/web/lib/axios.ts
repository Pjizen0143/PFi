// lib/axios.ts
import axios from "axios";
import { getSession } from "next-auth/react";

export const serverApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});