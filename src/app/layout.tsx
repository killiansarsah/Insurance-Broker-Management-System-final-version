import type { Metadata } from 'next';
import { Inter, Caveat } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat',
    display: 'swap',
    weight: ['400', '700'],
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
        <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
            <head>
                {/* Material Symbols — display=swap in URL prevents render-blocking text */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
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
