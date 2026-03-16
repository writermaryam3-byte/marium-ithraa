import { getSession, signOut } from "next-auth/react";
import { Methods, Pages, Routes } from "./types/enums";

const BASE_URL =  `/api`;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const token = session?.user?.accessToken;
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
    method: options.method ?? Methods.GET
  });

  if (response.status === 401) {
    signOut({ callbackUrl: `/${Routes.AUTH}/${Pages.LOGIN}` });
  }


  return response;
}