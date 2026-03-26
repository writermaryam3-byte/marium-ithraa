// import { signOut } from "next-auth/react";
// import { Methods, Pages, Routes } from "./types/enums";
// import { getServerSession } from "next-auth";
// import nextAuthOptions from "@/server/auth";

// const BASE_URL =  `${process.env.BACKEND_URL}/api`;

// export async function apiFetch(endpoint: string, options: RequestInit = {}) {
//   const session = await getServerSession(nextAuthOptions);
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
// lib/server-api-client.ts

import { getServerSession } from "next-auth";
import { ApiError } from "../errors/ApiError";
import { StatusCode } from "../types/enums";
import nextAuthOptions from "@/server/auth";

export async function serverApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getServerSession(nextAuthOptions);
  const token = session?.user?.accessToken;

  const res = await fetch(`${process.env.BACKEND_URL}/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    cache: "no-store",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new ApiError("Invalid server response", StatusCode.INTERNALSERVERERROR);
  }

  if (!res.ok) {
    if (res.status === StatusCode.BADREQUEST) throw new ApiError(data.message, res.status, data);
    throw new ApiError(data.message, res.status);
  }

  return data;
}