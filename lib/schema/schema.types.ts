import * as z from "zod";
import { createSpaceSchema } from "./schema";

export type CreateSpaceSchema = z.infer<typeof createSpaceSchema>;
