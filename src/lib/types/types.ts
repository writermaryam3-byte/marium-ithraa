import { ReactNode } from "react";
import { StatusCode } from "./enums";
import { ApiError } from "../errors/ApiError";

export type SelectData = {
  id: string | number,
  value: string,
  label: string
}


export type ValidationErrors = {
  [key: string]: string[];
};

export type InitialState = {
  message?: string;
  error?: ValidationErrors;
  status?: StatusCode | null;
  formData?: FormData | null;
}

export type CardInfo = {
  error?: ApiError|null,
  isLoading?: boolean,
  isErr?: boolean,
  description: string,
  title: string|number,
  icon?: ReactNode,
  badage: {
    exist: boolean,
  },
  footer: {
    exist: boolean
  }
}