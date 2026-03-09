'use client';

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Report to external service (Sentry, LogRocket, etc.) when configured
        if (typeof window !== 'undefined' && (window as Window & { __SENTRY__?: unknown }).__SENTRY__) {
            // Sentry auto-captures when its global integration is loaded
        }
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught:', error, info.componentStack);
        }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8">
                    <h2 className="text-xl font-semibold text-surface-900">Something went wrong</h2>
                    <p className="text-surface-500 text-sm text-center max-w-md">
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
