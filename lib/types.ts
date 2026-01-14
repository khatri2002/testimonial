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
  required: boolean;
  maxLength?: number;
  minLength?: number;
};

export type CloudinaryImage = {
  url: string;
  etag: string;
  tags: string[];
  type: string;
  bytes: number;
  width: number;
  format: "png" | "jpg" | "jpeg" | "webp";
  height: number;
  api_key: string;
  version: number;
  asset_id: string;
  public_id: string;
  signature: string;
  created_at: string;
  secure_url: string;
  version_id: string;
  placeholder: false;
  asset_folder: "";
  display_name: string;
  resource_type: string;
  original_filename: string;
};
