import { apiFetch } from "@/lib/api-clent";
import { Child } from "../types/interfaces";
import { Methods } from "@/lib/types/enums";

export const getChildren = async (): Promise<Child[]> => {
  const response = await apiFetch("/children");
  if (!response.ok) throw new Error("Failed to fetch children");
  return response.json();
};

export const createChild = async (data: Partial<Child>) => {
  return apiFetch("/children", {
    method: Methods.POST,
    body: JSON.stringify(data),
  });
};