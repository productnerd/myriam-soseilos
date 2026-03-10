import React from "react";
import { Button } from "@/components/ui/interactive/Button";

interface WelcomeStepProps {
	onContinue: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onContinue }) => {
	return (
		<div className="text-center space-y-6 flex flex-col h-full">
			{/* Peace sign icon */}
			<div className="mx-auto w-16 h-16 flex items-center justify-center text-4xl">✌️</div>

			<div className="space-y-4">
				<h1 className="text-2xl font-bold text-white">
					Welcome! Let's start by setting up your account
				</h1>

				<p className="text-white/80 text-sm leading-relaxed">
					Just follow a few simple steps to create your account and launch your first
					project on Portal
				</p>
			</div>

			<div className="flex-1"></div>

			<Button
				onClick={onContinue}
				size="lg"
				className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full mt-auto"
			>
				Start
			</Button>
		</div>
	);
};

export default WelcomeStep;
