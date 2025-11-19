type FieldsType =
  | "textInput"
  | "textarea"
  | "starRating"
  | "photoUpload"
  | "checkbox";

export type FormField = {
  name: string;
  type: FieldsType;
  label?: string;
  defaultValue: string | number | undefined | boolean;
  maxChars?: number;
  tooltip?: string;
  placeholder?: string;
  required?: boolean;
};
