import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | IBMS Portal',
        default: 'IBMS Portal',
    },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return children;
}
