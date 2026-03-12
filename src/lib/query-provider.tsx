'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import dynamic from 'next/dynamic';

// Only load devtools in development (~70KB saved in production)
const ReactQueryDevtools = dynamic(
    () => import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools })),
    { ssr: false },
);

export function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
