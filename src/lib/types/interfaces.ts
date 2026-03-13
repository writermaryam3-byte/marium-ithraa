import { FormTypes } from "./enums";
import { SelectData } from "./types";




export interface IEmail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}


export interface IOption {
  label: string;
  value: string;
}
export interface IFormField {
  name: string;
  label?: string;
  checked?: boolean;
  type:
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "time"
  | "datetime-local"
  | "checkbox"
  | "radio"
  | "select"
  | "hidden"
  | "textarea"
  | "markdown";
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  options?: IOption;
  id?: string;
  defaultValue?: string;
  readOnly?: boolean;
  data?: SelectData[]
}

export type Data = { [key: string]: SelectData[] }
export interface IFormFieldsVariables {
  slug: FormTypes;
  data?: Data
}
