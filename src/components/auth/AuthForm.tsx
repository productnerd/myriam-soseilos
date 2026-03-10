import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { Form } from "@/components/ui/form/Form";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import AuthFormField from "./AuthFormField";
import AuthSubmitButton from "./AuthSubmitButton";
import AuthModeToggle from "./AuthModeToggle";
import AuthLoadingScreen from "./AuthLoadingScreen";
import { LoginFormSchema, SignupFormSchema, FormValues } from "@/types/auth";

interface AuthFormProps {
	isLogin: boolean;
	setIsLogin: (isLogin: boolean) => void;
	hideHeader?: boolean;
	onAfterSignup?: (userId: string) => void;
	redirectAfterAuth?: string;
	accessCode?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
	isLogin,
	setIsLogin,
	hideHeader = false,
	onAfterSignup,
	redirectAfterAuth,
	accessCode,
}) => {
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [confirmationEmail, setConfirmationEmail] = useState("");
	const {
		form,
		isLoading,
		showLoadingScreen,
		onSubmit,
		redirectAfterAuth: redirectPath,
	} = useAuthForm({
		isLogin,
		setIsLogin,
		onAfterSignup: async (userId: string) => {
			console.log("User registered successfully, id:", userId);
			if (onAfterSignup) {
				return onAfterSignup(userId);
			}
		},
		redirectAfterAuth: isLogin ? redirectAfterAuth : "/learn",
		setShowConfirmation,
		setConfirmationEmail,
		inviteCode: accessCode,
		validationSchema: isLogin ? LoginFormSchema : SignupFormSchema,
	});

	if (showLoadingScreen) {
		return <AuthLoadingScreen redirectTo={redirectPath} />;
	}

	if (showConfirmation) {
		return (
			<Card className="w-[350px]">
				<CardContent className="grid gap-4 pt-6">
					<div className="text-center space-y-4">
						<h2 className="text-xl font-semibold">Check your email</h2>
						<p className="text-sm text-brown-200">
							We've sent a confirmation link to:
							<br />
							<span className="font-medium">{confirmationEmail}</span>
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-[350px]">
			<CardContent className="grid gap-4 pt-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<AuthFormField
							form={form}
							name="email"
							placeholder="mail@example.com"
							validateOnBlur={false}
							validateOnChange={false}
						/>

						<AuthFormField
							form={form}
							name="password"
							placeholder="Password"
							type="password"
							validateOnBlur={false}
							validateOnChange={false}
						/>

						<AuthSubmitButton isLoading={isLoading} isLogin={isLogin} />
					</form>
				</Form>

				<AuthModeToggle isLogin={isLogin} setIsLogin={setIsLogin} />
			</CardContent>
		</Card>
	);
};
