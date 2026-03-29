import type { Metadata } from 'next';
import { Outfit, DM_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { QueryProvider } from '@/lib/query-provider';
import { AppLoader } from '@/components/ui/AppLoader';
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
            { url: '/logo-icon.png' },
            { url: '/logo-icon.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/logo-icon.png',
        apple: [
            { url: '/logo-icon.png' },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${outfit.variable} ${dmMono.variable}`} suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function() {
                            try {
                                var storageKey = 'ibms-ui-storage';
                                var storedData = localStorage.getItem(storageKey);
                                var theme = 'system';
                                if (storedData) {
                                    var parsed = JSON.parse(storedData);
                                    theme = parsed?.state?.currentTheme || 'system';
                                }
                                var root = document.documentElement;
                                function applyTheme(t) {
                                    root.classList.remove('theme-light', 'theme-dark', 'theme-glass', 'theme-gold', 'theme-compact', 'dark');
                                    root.classList.add('theme-' + t);
                                    if (t === 'dark') {
                                        root.classList.add('dark');
                                    }
                                }
                                if (theme === 'system') {
                                    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                    applyTheme(isDark ? 'dark' : 'light');
                                } else {
                                    applyTheme(theme);
                                }
                            } catch (e) {}
                        })();
                        `,
                    }}
                />
            </head>
            <body className="antialiased">
                <AppLoader message="Loading application workspace..." fullScreen={true} />
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
