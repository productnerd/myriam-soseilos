import React from "react";
import { Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import AdminPage from "@/pages/AdminPage";
import SampleActivitiesPage from "@/pages/SampleActivitiesPage";
import SampleCompletionScreens from "@/pages/SampleCompletionScreens";

// Export an array of Route elements for use in other components if needed
export const adminRoutes = [
	<Route
		key="admin"
		path="/admin"
		element={
			<AdminRoute>
				<AdminPage />
			</AdminRoute>
		}
	/>,

	<Route
		key="admin-activity-submissions"
		path="/admin/activity-submissions"
		element={
			<AdminRoute>
				<AdminPage />
			</AdminRoute>
		}
	/>,

	<Route
		key="admin-user-feedback"
		path="/admin/user-feedback"
		element={
			<AdminRoute>
				<AdminPage />
			</AdminRoute>
		}
	/>,

	<Route
		key="sample-activities"
		path="/sample-activities"
		element={
			<AdminRoute>
				<SampleActivitiesPage />
			</AdminRoute>
		}
	/>,

	<Route
		key="sample-completion-screens"
		path="/sample-completion-screens"
		element={
			<AdminRoute>
				<SampleCompletionScreens />
			</AdminRoute>
		}
	/>,
];
