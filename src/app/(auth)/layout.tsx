import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | Brokerium Portal',
        default: 'Brokerium Portal',
    },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return children;
}
