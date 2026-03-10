// @ts-nocheck
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/interactive/Button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/layout/Card";
import { Alert, AlertDescription } from "@/components/ui/feedback/Alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/form/InputOTP";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/types/auth";
import { createUserProfile } from "@/hooks/auth/useProfileCreation";

// Enhanced validation schema for the access code
const accessCodeSchema = z
	.string()
	.length(8, { message: "Access code must be exactly 8 characters" })
	.regex(/^[A-Za-z0-9]+$/, {
		message: "Access code must contain only letters and numbers",
	})
	.transform((val) => val.toUpperCase()); // Normalize to uppercase

interface AccessCodeInputProps {
	user: AuthUser | null;
	onValidCode?: (code?: string) => void;
	testValidation?: (code: string) => Promise<boolean>;
}

const AccessCodeInput: React.FC<AccessCodeInputProps> = ({ user, onValidCode, testValidation }) => {
	const [accessCode, setAccessCode] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [attemptCount, setAttemptCount] = useState(0);
	const navigate = useNavigate();

	const MAX_ATTEMPTS = 5;

	const handleValueChange = (value: string) => {
		// Sanitize input - only allow alphanumeric characters
		const sanitizedValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
		setAccessCode(sanitizedValue);

		// Clear any previous error when the user changes the input
		if (errorMessage) {
			setErrorMessage(null);
		}
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) {
			e.preventDefault();
		}

		// Check attempt limit
		if (attemptCount >= MAX_ATTEMPTS) {
			setErrorMessage("Too many failed attempts. Please try again later.");
			return;
		}

		// Only validate when code is complete
		if (accessCode.length !== 8) {
			setErrorMessage("Please enter a complete 8-character access code");
			return;
		}

		try {
			// Validate the format and sanitize
			const result = accessCodeSchema.safeParse(accessCode);
			if (!result.success) {
				setErrorMessage(result.error.errors[0].message);
				setAttemptCount((prev) => prev + 1);
				return;
			}

			const validatedCode = result.data;
			setIsSubmitting(true);
			setErrorMessage(null);

			// If we have a test validation function, use that instead of the real validation
			if (testValidation) {
				console.log("Using test validation function");
				const isValid = await testValidation(validatedCode);
				setIsSubmitting(false);
				if (isValid && onValidCode) {
					onValidCode(validatedCode);
				} else {
					setErrorMessage("Invalid access code. Please try again or contact support.");
					setAttemptCount((prev) => prev + 1);
				}
				return;
			}

			if (!user?.id) {
				setErrorMessage("User not authenticated");
				setIsSubmitting(false);
				return;
			}

			console.log(`Validating access code ${validatedCode} for user ${user.id}`);

			// First, ensure the user has a profile
			console.log("Creating or verifying user profile");
			const profileCreated = await createUserProfile(user.id, user.email || "");

			if (!profileCreated) {
				setErrorMessage("Error creating your profile. Please try again.");
				setIsSubmitting(false);
				return;
			}

			console.log("Profile verified, proceeding to validate access code");

			// Call the function to validate the access code
			const { data, error } = await supabase.rpc("validate_access_code", {
				p_user_id: user.id,
				p_access_code: validatedCode,
			});

			console.log("Access code validation result:", data);

			// Always reset isSubmitting state after getting a response
			setIsSubmitting(false);

			if (error) {
				console.error("Error validating access code:", error);
				setErrorMessage("An error occurred when validating your access code");
				setAttemptCount((prev) => prev + 1);
				return;
			}

			if (data === true) {
				toast.success(`Access code accepted: ${validatedCode}`);

				if (onValidCode) {
					onValidCode(validatedCode);
				} else {
					// Show toast and redirect with delay for better UX
					toast.success("Redirecting to onboarding...", {
						duration: 1500,
					});

					// Adding a slight delay before redirect for better UX
					setTimeout(() => {
						console.log("Navigating to /onboarding after access code validation");
						navigate("/onboarding");
					}, 1500);
				}
			} else {
				// Invalid access code
				setErrorMessage("Invalid access code. Please try again or contact support.");
				setAttemptCount((prev) => prev + 1);
			}
		} catch (error) {
			console.error("Error validating access code:", error);
			setErrorMessage("An unexpected error occurred");
			setAttemptCount((prev) => prev + 1);
			setIsSubmitting(false);
		}
	};

	const isBlocked = attemptCount >= MAX_ATTEMPTS;

	return (
		<Card className="w-full max-w-md">
			<form onSubmit={handleSubmit}>
				<CardContent className="pt-6">
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5 items-center">
							<InputOTP
								maxLength={8}
								value={accessCode}
								onChange={handleValueChange}
								disabled={isBlocked}
							>
								<InputOTPGroup>
									{Array.from(Array(8).keys()).map((_, index) => (
										<InputOTPSlot key={index} index={index} />
									))}
								</InputOTPGroup>
							</InputOTP>
							<p className="text-xs text-muted-foreground mt-2">
								Enter 8 characters, letters and numbers only
							</p>
							{attemptCount > 0 && (
								<p className="text-xs text-orange-500">
									Attempts remaining: {MAX_ATTEMPTS - attemptCount}
								</p>
							)}
						</div>

						{errorMessage && (
							<Alert variant="destructive" className="mt-2">
								<AlertDescription>{errorMessage}</AlertDescription>
							</Alert>
						)}
					</div>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || accessCode.length !== 8 || isBlocked}
						onClick={handleSubmit}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Validating...
							</>
						) : isBlocked ? (
							"Too many attempts"
						) : (
							"Verify Code"
						)}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
};

export default AccessCodeInput;
