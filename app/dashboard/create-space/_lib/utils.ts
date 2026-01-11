export const generateSlug = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-") // replace invalid chars with hyphens
    .replace(/^-+|-+$/g, ""); // trim hyphens from start and end
