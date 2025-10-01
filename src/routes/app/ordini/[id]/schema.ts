import { z } from "zod";

export const formSchema = z.object({
    username: z.string().min(2).max(50),
    bio: z.string(),
    tos: z.boolean(),
    /* urls: z
        .array(z.string().url({ message: "Please enter a valid URL." }))
        .min(2, "You must include at least two URLs on your profile.")
        .default([""]), */
    skills: z
        .array(z.string().min(1))
        .min(2, "Add at least two skill")
        .default([""]),
    /* emails: z
        .array(z.string().email())
        .min(1, "At least one email is required")
        .default([""]), */
    dob: z
        .string()
        .refine((v) => v, { message: "A date of birth is required." }),
    language: z.enum(['fr', 'en', 'de', 'es', 'pt', 'ru', 'ja', 'ko', 'zh']),
    notifications: z.enum(['all', 'mentions', 'none']).default('mentions')
});

export type FormSchema = typeof formSchema;
