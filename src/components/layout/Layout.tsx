import React from "react";
import { Outlet } from "react-router-dom"; // Outlet: A placeholder for where child routes are rendered
import Header from "./Header";
import TabBar from "../navigation/TabBar";

interface LayoutProps {
	children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col w-full">
			<Header />
			{/* Using fixed header height for precise spacing - full width content */}
			<main className="flex-1 mt-[56px] pb-20 overflow-y-auto relative w-full">
				{children || <Outlet />}
			</main>
			<TabBar />
		</div>
	);
};

export default Layout;
