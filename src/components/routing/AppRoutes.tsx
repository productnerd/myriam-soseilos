import React from "react";

// Route: Defines which component to Render based on the URL
import { Routes, Route } from "react-router-dom";

// Authentication and route protection components
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccessCodeProtectedRoute from "@/components/routing/AccessCodeProtectedRoute";
import AdminRoute from "@/components/routing/AdminRoute";

// Layout components
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";

import { PublicRoutes } from "@/components/routing/PublicRoutes";
import { MainLayoutRoutes } from "@/components/routing/MainLayoutRoutes";

import OnboardingPage from "@/pages/OnboardingPage";
import OnboardingTestPage from "@/pages/OnboardingTestPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";
import SampleActivitiesPage from "@/pages/SampleActivitiesPage";
import SampleCompletionScreens from "@/pages/SampleCompletionScreens";

/**
 * Main routing configuration for the application
 *
 * This component defines all the routes in the application
 *
 * Route Structure:
 * - Public routes: No authentication required
 * - Protected routes: Require authentication via ProtectedRoute
 * - Access-controlled routes: Require authentication + access code
 * - Admin routes: Require authentication + admin privileges
 */
const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* PUBLIC ROUTES - No authentication required */}
			{PublicRoutes}

			{/* ACCESS-CONTROLLED ROUTES - Require authentication + access code */}
			<Route
				path="/onboarding"
				element={
					<ProtectedRoute>
						<AccessCodeProtectedRoute>
							<OnboardingPage />
						</AccessCodeProtectedRoute>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/onboarding-test"
				element={
					<ProtectedRoute>
						<AccessCodeProtectedRoute>
							<OnboardingTestPage />
						</AccessCodeProtectedRoute>
					</ProtectedRoute>
				}
			/>

			{/* This route is in PublicRoutes - should it be here instead? i.e. is access code required for this route? */}
			{/* <Route
                path="/cards"
                element={
                    <ProtectedRoute>
                        <AccessCodeProtectedRoute>
                            <CardPage />
                        </AccessCodeProtectedRoute>
                    </ProtectedRoute>
                }
            /> */}

			{/* ADMIN ROUTES - Require authentication + admin privileges */}
			<Route
				path="/admin"
				element={
					<ProtectedRoute>
						<AdminRoute>
							<AdminPage />
						</AdminRoute>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/activity-submissions"
				element={
					<ProtectedRoute>
						<AdminRoute>
							<AdminPage />
						</AdminRoute>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/user-feedback"
				element={
					<ProtectedRoute>
						<AdminRoute>
							<AdminPage />
						</AdminRoute>
					</ProtectedRoute>
				}
			/>

			<Route
				path="/sample-activities"
				element={
					<ProtectedRoute>
						<AdminRoute>
							<SampleActivitiesPage />
						</AdminRoute>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/sample-completion-screens"
				element={
					<ProtectedRoute>
						<AdminRoute>
							<SampleCompletionScreens />
						</AdminRoute>
					</ProtectedRoute>
				}
			/>

			{/* Main authenticated routes - require authentication */}
			<Route
				element={
					<ProtectedRoute>
						<AuthenticatedLayout />
					</ProtectedRoute>
				}
			>
				{MainLayoutRoutes}
			</Route>

			{/* CATCH-ALL ROUTE - Show NotFound if no other route matches */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AppRoutes;
