import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'IBMS — Insurance Broker Management System',
    description:
        'NIC-compliant insurance brokerage management platform for Ghana. Manage clients, policies, claims, leads, and compliance.',
    icons: {
        icon: [
            { url: '/logo.png' },
            { url: '/logo.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/logo.png',
        apple: [
            { url: '/logo.png' },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="antialiased">
                <ThemeProvider />
                <ThemeProvider />
                {children}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                        duration: 4000,
                    }}
                />
            </body>
        </html>
    );
}
