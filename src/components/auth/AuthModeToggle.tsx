import React from "react";
import { Button } from "@/components/ui/interactive/Button";

interface AuthModeToggleProps {
	isLogin: boolean;
	setIsLogin: (isLogin: boolean) => void;
}

const AuthModeToggle: React.FC<AuthModeToggleProps> = ({ isLogin, setIsLogin }) => {
	return (
		<div className="text-center">
			<p className="text-sm text-muted-foreground">
				{isLogin ? "Haven't joined?" : "Already have an account?"}{" "}
				<Button
					variant="link"
					className="p-0 h-auto font-normal underline"
					onClick={() => setIsLogin(!isLogin)}
				>
					{isLogin ? "Register" : "Login"}
				</Button>
			</p>
		</div>
	);
};

export default AuthModeToggle;
