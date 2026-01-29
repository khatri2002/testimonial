import { Response } from "@/prisma/src/generated/prisma/client";

export type ResponsesById = Record<string, Response>;
export type IncludedIds = string[];
export type EmbedWallContextData = {
  id: string;
  responsesById: ResponsesById;
  includedIds: IncludedIds;
  published: boolean;
};
export type ResponseWithInclusion = Response & { isIncluded: boolean };
