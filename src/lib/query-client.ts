import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

// Helper to extract a friendly error message from API responses
const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object') {
        const axErr = error as any;
        if (axErr.response?.data?.message) {
            return axErr.response.data.message;
        }
    }
    if (error instanceof Error) return error.message;
    return 'An unexpected error occurred';
};

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            // Only toast if we don't already have data (a hard failure)
            if (query.state.data === undefined) {
                toast.error(`Failed to load data`, {
                    description: getErrorMessage(error),
                });
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            // Only toast if the mutation hasn't handled its own error
            if (!mutation.options.onError) {
                toast.error(`Action failed`, {
                    description: getErrorMessage(error),
                });
            }
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});
