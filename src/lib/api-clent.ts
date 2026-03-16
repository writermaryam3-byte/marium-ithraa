import { signOut } from "next-auth/react";
import { Methods, Pages, Routes } from "./types/enums";
import { getServerSession } from "next-auth";
import nextAuthOptions from "@/server/auth";

const BASE_URL =  `${process.env.BACKEND_URL}/api`;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await getServerSession(nextAuthOptions);
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