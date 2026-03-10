import { Route } from "react-router-dom";
import AuthPage from "@/pages/AuthPage";
import InvitePage from "@/pages/InvitePage";
import Index from "@/pages/Index";
import CardPage from "@/pages/CardPage";
import AccessCodePage from "@/pages/AccessCodePage";
import LifeInWeeksPage from "@/pages/LifeInWeeksPage";

/**
 * PublicRoutes: All routes that don't require authentication
 *
 * These routes are accessible to everyone, including unauthenticated users.
 * They handle authentication flows, invitations, and public content.
 */
export const PublicRoutes = (
	<>
		{/* Landing page */}
		<Route key="index" path="/" element={<Index />} />

		{/* Authentication routes */}
		{/* TODO: Why have both '/auth' and '/login' if they are both directing to the same page? */}
		<Route key="auth" path="/auth" element={<AuthPage />} />
		<Route key="login" path="/login" element={<AuthPage />} />
		<Route key="forgot-password" path="/forgot-password" element={<AuthPage />} />
		<Route key="reset-password" path="/reset-password/:token" element={<AuthPage />} />

		{/* Access code entry */}
		<Route key="access-code" path="/access-code" element={<AccessCodePage />} />

		{/* Invitation routes */}
		<Route key="invite" path="/invite" element={<InvitePage />} />
		<Route key="invite-with-code" path="/invite/:accessCode" element={<InvitePage />} />

		{/* Public content */}
		<Route key="card" path="/card" element={<CardPage />} />
		<Route key="life-in-weeks" path="/life-in-weeks" element={<LifeInWeeksPage />} />
	</>
);
