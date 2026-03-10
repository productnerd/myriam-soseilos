import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import TabBar from "@/components/navigation/TabBar";

/**
 * AuthenticatedLayout - Main layout component for authenticated users
 *
 * This component provides the consistent UI layout for all authenticated routes
 *
 * Flow:
 * 1. Renders the main layout structure (Header, main content area, TabBar)
 * 2. Uses <Outlet /> to render the current route's content
 * 3. Child components can access user data directly via 'useUserContext' hook
 */
const AuthenticatedLayout: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col w-full">
			<Header />
			<main className="flex-1 mt-[56px] pb-20 overflow-y-auto relative w-full">
				<Outlet />
			</main>
			<TabBar />
		</div>
	);
};

export default AuthenticatedLayout;
