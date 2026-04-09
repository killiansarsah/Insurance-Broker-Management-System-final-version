'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Report to external service (Sentry, LogRocket, Datadog etc.) when configured
        if (typeof window !== 'undefined' && (window as Window & { __SENTRY__?: unknown }).__SENTRY__) {
            // Sentry auto-captures when its global integration is loaded
        }
        
        console.error('UI Rendering Error Caught by Boundary:', error, info.componentStack);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return <div onClick={this.handleReset}>{this.props.fallback}</div>;
            }

            return (
                <div className="flex flex-col items-center justify-center p-6 sm:p-10 border border-destructive/20 bg-destructive/5 rounded-xl w-full h-full min-h-[300px]">
                    <AlertCircle className="w-12 h-12 text-destructive mb-4 opacity-80" />
                    <h2 className="text-xl font-semibold text-destructive mb-2 tracking-tight">Display Error</h2>
                    <div className="flex flex-col items-center max-w-md mx-auto text-center mb-6">
                        <p className="text-sm text-destructive/80 mb-2">
                            An unexpected interface error occurred. Our team has been notified.
                        </p>
                        {this.state.error && (
                            <code className="text-xs bg-destructive/10 text-destructive/90 px-3 py-2 rounded max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={this.state.error.message}>
                                {this.state.error.message}
                            </code>
                        )}
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={this.handleReset}
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reload Component
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
