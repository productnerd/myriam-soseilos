import React from "react";
import { Spinner } from "@/components/ui/Spinner";

const CompletionStep: React.FC = () => {
	// TODO: Previous implementation has a 'useEffect' that marked the onboarding as completed. Are we not doing that anymore?

	return (
		<div className="text-center space-y-6">
			<div className="mx-auto w-16 h-16 flex items-center justify-center text-4xl">🎉</div>

			<div className="space-y-4">
				<h1 className="text-2xl font-bold text-white">
					Thank you for completing the onboarding!
				</h1>

				<p className="text-white/80 text-sm">
					You're now being redirected to the learning page...
				</p>
			</div>

			<div className="flex justify-center">
				<Spinner size="lg" className="text-white" />
			</div>
		</div>
	);
};

export default CompletionStep;
