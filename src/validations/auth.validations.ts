import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type signInSchemaType = z.infer<typeof signInSchema>;