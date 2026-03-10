/* @tanstack/react-query: Used for data-fetching and state management (replaces `useState` and `useEffect`). Features include:
  - Automatic data caching
  - Background updates for stale data
  - Automatic retries on failed requests
  - Automatic error handling (`isLoading`, `isError`)

 • QueryClient: Manages the cache and query state (loading, success, error). A single instance manages all API requests.
 • QueryClientProvider: Makes `QueryClient` available to the app components. You wrap your app in it.
*/
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/*
 • useQuery: Custom hook for fetching data
 • useMutation: Custom hook for updating data
 • useInfiniteQuery: Custom hook for fetching paginated data
 • useSuspenseQuery: Custom hook for fetching data with suspense fallback
 • useSuspenseInfiniteQuery: Custom hook for fetching paginated data with suspense fallback
*/

// BrowserRouter enables routing (navigation between different pages based on the URL)
import { BrowserRouter } from "react-router-dom";

// Component that manages user authentication
import { AuthProvider } from "@/components/auth/AuthProvider";

// Global user context provider - provides user data to all components
import { UserProvider, useUserContext } from "@/contexts/UserContext";

// Global course context provider - provides course data to all components
import { CourseProvider } from "@/contexts/CourseContext";

// Component that manages all our application routes
import AppRoutes from "@/components/routing/AppRoutes";

// Component for showing toast notifications (short, informational messages) to users
import { Toaster } from "@/components/ui/feedback/Sonner";

// Custom hook for managing user streaks. This is used to check and reset the user's streak when they log in.
import { useStreakReset } from "@/hooks/streak/useStreakReset";

// Application styles
import "./App.css";

// Configure the React Query client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
			retry: 1, // Only retry failed requests once
		},
	},
});

// Separate component for the main app content to keep the code organized and allow for the streak check
function AppContent() {
	// Get user data from global context
	const { user } = useUserContext();

	// Check and reset streak when user is logged in
	useStreakReset(user?.id || null);

	return <AppRoutes />;
}

// Main App component that sets up the core providers
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<UserProvider>
						<CourseProvider>
							<AppContent />
							<Toaster />
						</CourseProvider>
					</UserProvider>
				</AuthProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

// Export the App component as the default export
export default App;
