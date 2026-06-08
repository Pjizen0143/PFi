import axios, { AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import type { ApiResponse } from "@/lib/types";

export const serverApi = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Shared response interceptor
const unwrapResponse = (response: AxiosResponse) => {
  const body = response.data as ApiResponse<unknown>;
  if (body.error) return Promise.reject(body.error);
  response.data = body.data;
  return response;
};

const rejectError = (error: unknown) => Promise.reject(error);

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});


api.interceptors.response.use(unwrapResponse, rejectError);
serverApi.interceptors.response.use(unwrapResponse, rejectError);