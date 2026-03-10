import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, SignupFormSchema, FormValues } from "@/types/auth";
import { useAuthSubmission } from "./useAuthSubmission";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

interface UseAuthFormProps {
	isLogin: boolean;
	setIsLogin?: (isLogin: boolean) => void;
	onAfterSignup?: (userId: string) => void;
	redirectAfterAuth?: string;
	setShowConfirmation?: (show: boolean) => void;
	setConfirmationEmail?: (email: string) => void;
	inviteCode?: string;
	validationSchema?: z.ZodSchema<any>;
}

export const useAuthForm = ({
	isLogin,
	onAfterSignup,
	redirectAfterAuth = "/learn",
	setShowConfirmation,
	setConfirmationEmail,
	inviteCode,
	validationSchema,
}: UseAuthFormProps) => {
	const navigate = useNavigate();
	const [showLoadingScreen, setShowLoadingScreen] = useState(false);

	// Use the provided schema or default to the appropriate one
	const schema = validationSchema || (isLogin ? LoginFormSchema : SignupFormSchema);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const authSubmission = useAuthSubmission({
		onSuccess: async (data) => {
			if (data.user) {
				if (isLogin) {
					// For login, show loading and redirect
					setShowLoadingScreen(true);
					setTimeout(() => {
						navigate(redirectAfterAuth);
					}, 1500);
				} else {
					// For signup
					if (data.session) {
						// If we already have a session, user is authenticated
						if (onAfterSignup) {
							await onAfterSignup(data.user.id);
						}

						setShowLoadingScreen(true);
						setTimeout(() => {
							navigate(redirectAfterAuth);
						}, 1500);
					} else {
						// No session yet (email confirmation needed)
						if (setShowConfirmation && setConfirmationEmail) {
							setConfirmationEmail(form.getValues().email);
							setShowConfirmation(true);
						}
					}
				}
			}
		},
		inviteCode,
	});

	const { loading } = authSubmission;

	const onSubmit = async (values: FormValues) => {
		const { email, password } = values;

		if (isLogin) {
			await authSubmission.handleLogin(email, password);
		} else {
			await authSubmission.handleSignup(email, password);
		}
	};

	return {
		form,
		isLoading: loading,
		showLoadingScreen,
		onSubmit,
		redirectAfterAuth,
	};
};
