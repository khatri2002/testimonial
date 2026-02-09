import * as z from "zod";
import { authSchema, embedWallSchema, spaceSchema } from "./schema";

export type SpaceSchema = z.infer<typeof spaceSchema>;
export type EmbedWallSchema = z.infer<typeof embedWallSchema>;
export type AuthSchema = z.infer<typeof authSchema>;
