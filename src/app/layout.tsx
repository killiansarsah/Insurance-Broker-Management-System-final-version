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
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
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
