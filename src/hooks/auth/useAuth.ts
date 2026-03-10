import { useAuthSession } from "./useAuthSession";
import { useSignOut } from "./useSignOut";

/**
 * Main auth hook that combines session state and auth actions
 */
export function useAuth() {
	const authState = useAuthSession();
	const { handleSignOut } = useSignOut();

	return {
		...authState,
		handleSignOut,
	};
}
