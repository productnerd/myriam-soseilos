import * as z from "zod";

export interface AuthState {
	isLoggedIn: boolean; // Is user logged in?
	user: AuthUser | null; // User data if logged in
	loading: boolean; // Is auth being checked?
}

// TODO: These are not used anywhere
export interface RedirectOptions {
	skipForPaths?: string[];
}

export type UserRole = "user" | "admin";

export interface AuthUser {
	id: string;
	email?: string | null;
	isAdmin: boolean;
	name?: string | null;
	poll_sharing?: boolean;
	score_sharing?: boolean;
	tags?: string[] | null;
}

// Schema for login - more lenient password requirements
export const LoginFormSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
});

// Schema for signup - strict password requirements
export const SignupFormSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
			message:
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
		}),
});

// For backward compatibility
export const FormSchema = SignupFormSchema;

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
export type SignupFormValues = z.infer<typeof SignupFormSchema>;
export type FormValues = z.infer<typeof FormSchema>;
