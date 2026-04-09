import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Claims',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
