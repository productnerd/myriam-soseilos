import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { Input } from "@/components/ui/form/Input";
import { Button } from "@/components/ui/interactive/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InviteFormCardProps {
	onSetMessage: (message: string) => void;
}

const InviteFormCard: React.FC<InviteFormCardProps> = ({ onSetMessage }) => {
	const navigate = useNavigate();
	const [accessCodeInput, setAccessCodeInput] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const verifyAccessCode = async () => {
		if (!accessCodeInput.trim()) {
			onSetMessage("That key does not seem right.");
			setErrorMessage("Please enter an access key.");
			return;
		}

		setIsVerifying(true);
		setErrorMessage(null);

		try {
			// We check for the access_code.code value
			const codeToVerify = accessCodeInput.trim();
			console.log("Verifying access code:", codeToVerify);

			// First, try to find the access code directly
			const { data, error } = await supabase
				.from("access_codes")
				.select("id, code, is_active")
				.eq("code", codeToVerify)
				.maybeSingle();

			console.log("Verification response:", { data, error });

			if (error) {
				console.error("Error verifying access code:", error);
				console.error("Error details:", error.message, error.details);
				onSetMessage("Something went wrong. Please try again.");
				setErrorMessage(`Error verifying access key: ${error.message}`);
				setIsVerifying(false);
				return;
			}

			if (!data) {
				console.error("Access code not found:", codeToVerify);
				onSetMessage("That key does not seem right.");
				setErrorMessage("Access key has expired or cannot be found.");
				setIsVerifying(false);
				return;
			}

			if (!data.is_active) {
				console.error("Access code is inactive:", data);
				onSetMessage("This access key has been deactivated.");
				setErrorMessage("This access key is no longer active.");
				setIsVerifying(false);
				return;
			}

			// Valid code found
			console.log("Valid access code found:", data);
			setIsVerified(true);
			setErrorMessage(null);
			onSetMessage("Great! I found your invitation.");
			toast.success("Access code verified successfully!");

			// Wait briefly to show the verified state before redirecting
			setTimeout(() => {
				// Navigate to the invite page with the UUID, not the code text
				navigate(`/invite/${data.id}`);
			}, 1000);
		} catch (err) {
			console.error("Verification failed:", err);
			onSetMessage("Something went wrong. Please try again.");
			setErrorMessage("An unexpected error occurred. Please try again.");
			setIsVerifying(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !isVerifying && !isVerified) {
			e.preventDefault();
			verifyAccessCode();
		}
	};

	return (
		<Card className="w-full max-w-md mb-6">
			<CardContent className="pt-6">
				<div className="space-y-4">
					<div className="flex gap-2">
						<Input
							value={accessCodeInput}
							onChange={(e) => setAccessCodeInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Paste your access key"
							className="flex-1"
							disabled={isVerifying || isVerified}
						/>
						<Button
							onClick={verifyAccessCode}
							disabled={isVerifying || isVerified}
							variant={isVerified ? "default" : "default"}
							className={isVerified ? "bg-green-500 hover:bg-green-600" : ""}
						>
							{isVerifying ? (
								<>
									<Spinner size="sm" className="mr-2" />
									Checking
								</>
							) : isVerified ? (
								<>
									<Check className="mr-2" />
									Confirmed
								</>
							) : (
								"Verify"
							)}
						</Button>
					</div>
					{errorMessage && <div className="text-xs text-red-500">{errorMessage}</div>}
				</div>
			</CardContent>
		</Card>
	);
};

export default InviteFormCard;
