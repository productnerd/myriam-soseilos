
import { z } from "zod";

export const authFormSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	name: z.string().optional(),
});

export type FormValues = z.infer<typeof authFormSchema>;

// Add this export that's expected by useFormHandling
export const FormSchema = authFormSchema;
