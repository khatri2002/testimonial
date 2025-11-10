import * as z from "zod";
import { testimonialForm } from "./schema";

export type TestimonialForm = z.infer<typeof testimonialForm>;
