export type FieldConfig = {
  info?: string;
  characterCounter?: {
    enabled?: boolean;
    enforceLimit?: boolean;
    maxCharacters?: number;
  };
} | null;

export type FieldValidations = {
  type: "number" | "string" | "email" | "boolean";
  required?: boolean;
  maxLength?: number;
  minLength?: number;
};
