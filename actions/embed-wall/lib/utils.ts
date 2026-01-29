import { ADJECTIVES, NOUNS } from "./config";

const hashString = (input: string): number => {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // convert to 32bit int
  }

  return Math.abs(hash);
};

export const generateEmbedWallName = (seed: string) => {
  const hash = hashString(seed);

  const adjective = ADJECTIVES[hash % ADJECTIVES.length];
  const noun = NOUNS[hash % NOUNS.length];

  return `${adjective} ${noun}`;
};

export const withSuffix = (baseName: string, count: number) =>
  count > 1 ? `${baseName} (${count})` : baseName;
