export const slugify = (text: string) => {
  return text
    .toString() // Ensure the input is a string
    .normalize("NFD") // Decompose combined graphemes (e.g., accented characters)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents)
    .toLowerCase() // Convert to lowercase
    .trim() // Trim leading/trailing whitespace
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove all non-word chars except hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens
};
