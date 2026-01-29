import * as z from "zod";
import { embedWallSchema, spaceSchema } from "./schema";

export type SpaceSchema = z.infer<typeof spaceSchema>;
export type EmbedWallSchema = z.infer<typeof embedWallSchema>;
