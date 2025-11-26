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

export type CloudinaryImgSrc = {
  url: string;
  etag: string;
  tags: Array<string>;
  type: string;
  bytes: number;
  width: number;
  format: "jpg" | "jpeg" | "png" | "webp";
  height: number;
  version: number;
  asset_id: string;
  existing: boolean;
  public_id: string;
  signature: string;
  created_at: string;
  secure_url: string;
  version_id: string;
  placeholder: boolean;
  asset_folder: string;
  display_name: string;
  resource_type: string;
  original_filename: string;
  original_extension: "jpeg" | "png" | "jpg" | "webp";
};
