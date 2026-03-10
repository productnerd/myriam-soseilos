
import { QueryClient } from '@tanstack/react-query';

// Create a new QueryClient instance outside of the component to prevent recreation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
