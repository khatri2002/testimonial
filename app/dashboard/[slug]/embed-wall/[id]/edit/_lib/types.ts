import { Response } from "@/prisma/src/generated/prisma/client";

export type ResponsesById = Record<string, Response>;
export type IncludedIds = string[];
export type EmbedWallContextData = {
  responsesById: ResponsesById;
  includedIds: IncludedIds;
};
export type ResponseWithInclusion = Response & { isIncluded: boolean };
