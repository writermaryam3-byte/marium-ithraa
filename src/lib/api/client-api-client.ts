// import { getSession, signOut } from "next-auth/react";
// import { Methods, Pages, Routes } from "./types/enums";

// const BASE_URL =  `/api`;

// export async function apiFetch(endpoint: string, options: RequestInit = {}) {
//   const session = await getSession();
//   const token = session?.user?.accessToken;
//   const headers = {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...options.headers,
//   };

//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//     cache: "no-store",
//     method: options.method ?? Methods.GET
//   });

//   if (response.status === 401) {
//     signOut({ callbackUrl: `/${Routes.AUTH}/${Pages.LOGIN}` });
//   }


//   return response;
// }

// lib/api-client.ts

import { getSession, signOut } from "next-auth/react";
import { ApiError } from "../errors/ApiError";
import { StatusCode } from "../types/enums";

let cachedToken: string | null = null;

async function getToken() {
  if (cachedToken) return cachedToken;

  const session = await getSession();
  cachedToken = session?.user?.accessToken || null;
  return cachedToken;
}

export async function clientApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // 🔥 handle 401 globally
  if (res.status === 401) {
    signOut();
    throw new Error("Unauthorized");
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new ApiError("Invalid server response", StatusCode.INTERNALSERVERERROR);
  }

  if (!res.ok) {
    throw new ApiError(data.message, res.status);
  }

  return data;
}