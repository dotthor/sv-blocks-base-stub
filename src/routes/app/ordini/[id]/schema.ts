import { z } from "zod";

export const formSchema = z.object({
    username: z.string().min(2).max(50),
    bio: z.string(),
    tos: z.boolean(),
    urls: z
        .array(z.string().url({ message: "Please enter a valid URL." }))
        .min(2, "You must include at least two URLs on your profile.")
        .default([""]),
    skills: z
        .array(z.string().min(1))
        .min(1, "Add at least one skill")
        .default([""]),
    emails: z
        .array(z.string().email())
        .min(1, "At least one email is required")
        .default([""]),
    dob: z
        .string()
        .refine((v) => v, { message: "A date of birth is required." })
});

export type FormSchema = typeof formSchema;