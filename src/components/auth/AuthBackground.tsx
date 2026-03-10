import React from "react";

interface AuthBackgroundProps {
	children: React.ReactNode;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
	return <div className="min-h-screen flex items-center justify-center p-4">{children}</div>;
};
