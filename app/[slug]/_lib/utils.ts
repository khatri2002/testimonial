import { FormField } from "@/lib/types";

export const getDefaultValues = (fields: Array<FormField>) =>
  fields.reduce<Record<string, any>>((acc, item) => {
    acc[item.name] = item.defaultValue;
    return acc;
  }, {});
