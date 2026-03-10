import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
	submitting: boolean;
	isResubmission: boolean;
	isUploadingImage?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
	submitting,
	isResubmission,
	isUploadingImage = false,
}) => {
	return (
		<Button
			type="submit"
			className={`w-full ${
				isResubmission ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
			}`}
			disabled={submitting}
		>
			{submitting ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					<span>{isUploadingImage ? "Uploading image..." : "Submitting..."}</span>
				</>
			) : (
				<>{isResubmission ? "Resubmit Quest" : "Submit Quest"}</>
			)}
		</Button>
	);
};

export default SubmitButton;
