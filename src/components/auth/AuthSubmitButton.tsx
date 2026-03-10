import React from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Icons } from "../ui/Icons";

interface AuthSubmitButtonProps {
	isLoading: boolean;
	isLogin: boolean;
}

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({ isLoading, isLogin }) => {
	return (
		<Button disabled={isLoading} type="submit" className="w-full">
			{isLoading ? (
				<>
					<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					Please wait
				</>
			) : isLogin ? (
				"Enter"
			) : (
				"Register"
			)}
		</Button>
	);
};

export default AuthSubmitButton;
