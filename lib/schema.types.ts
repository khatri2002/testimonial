import * as z from "zod";
import { spaceSchema } from "./schema";

export type SpaceSchema = z.infer<typeof spaceSchema>;
