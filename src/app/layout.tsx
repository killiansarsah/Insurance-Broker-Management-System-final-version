import type { Metadata } from 'next';
import { Outfit, DM_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { QueryProvider } from '@/lib/query-provider';
import './globals.css';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const dmMono = DM_Mono({
    subsets: ['latin'],
    variable: '--font-dm-mono',
    display: 'swap',
    weight: ['400', '500'],
});

export const metadata: Metadata = {
    title: {
        default: 'IBMS — Insurance Broker Management System',
        template: '%s | IBMS',
    },
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
        <html lang="en" className={`${outfit.variable} ${dmMono.variable}`}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="antialiased">
                <ThemeProvider />
                <QueryProvider>
                    {children}
                </QueryProvider>
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
