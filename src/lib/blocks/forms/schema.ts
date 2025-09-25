import { z } from "zod";

export const formSchema = z.object({
    username: z.string().min(2).max(50),
    bio: z.string(),
    tos: z.string()
});

export type FormSchema = typeof formSchema;