'use client';

import { useState } from 'react';
import { Palette, Monitor, PanelLeft, Type, Sun, Moon, Laptop, LayoutGrid, LayoutList, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

export function SettingsAppearance() {
    const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left');
    const [layoutDensity, setLayoutDensity] = useState<'comfortable' | 'compact' | 'spacious'>('comfortable');
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

    return (
        <div className="space-y-6">
            {/* Theme Selection */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                        <Palette size={18} />
                    </div>
                    Color Theme
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ThemeOption
                        name="Gold / Industrial"
                        description="Deep, warm tones with gold accents"
                        value="gold"
                        colors={['#c28532', '#1a1a2e', '#f4f1ec', '#2a2a3a']}
                    />
                    <ThemeOption
                        name="Liquid Glass"
                        description="Frosted transparency with light reflections"
                        value="glass"
                        colors={['#3b82f6', '#f8fafc', '#e2e8f0', '#0ea5e9']}
                    />
                    <ThemeOption
                        name="Compact Classic"
                        description="Clean, minimal with high information density"
                        value="compact"
                        colors={['#6366f1', '#ffffff', '#f1f5f9', '#4f46e5']}
                    />
                </div>
            </Card>

            {/* Display Mode */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Monitor size={18} />
                    </div>
                    Display Mode
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    <DisplayModeOption icon={Sun} label="Light" active />
                    <DisplayModeOption icon={Moon} label="Dark" />
                    <DisplayModeOption icon={Laptop} label="System" />
                </div>
            </Card>

            {/* Layout Preferences */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                        <PanelLeft size={18} />
                    </div>
                    Layout Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sidebar Position */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-surface-900">Sidebar Position</p>
                        <p className="text-xs text-surface-500 font-medium">Choose which side the navigation appears on.</p>
                        <div className="flex gap-3 mt-3">
                            <button
                                onClick={() => setSidebarPosition('left')}
                                className={cn(
                                    "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                                    sidebarPosition === 'left'
                                        ? "border-primary-500 bg-primary-50"
                                        : "border-surface-200 hover:border-surface-300"
                                )}
                            >
                                <div className="w-16 h-10 rounded-lg bg-surface-100 flex overflow-hidden border border-surface-200">
                                    <div className="w-4 h-full bg-primary-500/30" />
                                    <div className="flex-1" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-surface-600">Left</span>
                            </button>
                            <button
                                onClick={() => setSidebarPosition('right')}
                                className={cn(
                                    "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                                    sidebarPosition === 'right'
                                        ? "border-primary-500 bg-primary-50"
                                        : "border-surface-200 hover:border-surface-300"
                                )}
                            >
                                <div className="w-16 h-10 rounded-lg bg-surface-100 flex overflow-hidden border border-surface-200">
                                    <div className="flex-1" />
                                    <div className="w-4 h-full bg-primary-500/30" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-surface-600">Right</span>
                            </button>
                        </div>
                    </div>

                    {/* Layout Density */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-surface-900">Layout Density</p>
                        <p className="text-xs text-surface-500 font-medium">Control spacing between interface elements.</p>
                        <div className="flex gap-3 mt-3">
                            {([
                                { value: 'compact', label: 'Compact', icon: LayoutList },
                                { value: 'comfortable', label: 'Comfort', icon: LayoutGrid },
                                { value: 'spacious', label: 'Spacious', icon: Minus },
                            ] as const).map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setLayoutDensity(option.value)}
                                    className={cn(
                                        "flex-1 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                                        layoutDensity === option.value
                                            ? "border-primary-500 bg-primary-50"
                                            : "border-surface-200 hover:border-surface-300"
                                    )}
                                >
                                    <option.icon size={18} className={layoutDensity === option.value ? "text-primary-600" : "text-surface-400"} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-surface-600">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Typography */}
            <Card padding="lg">
                <h3 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <Type size={18} />
                    </div>
                    Typography
                </h3>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-bold text-surface-900 mb-1">Font Size</p>
                        <p className="text-xs text-surface-500 font-medium mb-4">Adjust the base font size across the interface.</p>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-surface-400">A</span>
                            <div className="flex-1 flex gap-2">
                                {(['small', 'medium', 'large'] as const).map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setFontSize(size)}
                                        className={cn(
                                            "flex-1 py-2.5 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all",
                                            fontSize === size
                                                ? "border-primary-500 bg-primary-50 text-primary-700"
                                                : "border-surface-200 text-surface-500 hover:border-surface-300"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <span className="text-lg font-bold text-surface-400">A</span>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-6 p-6 rounded-2xl bg-surface-50 border border-surface-100">
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-3">Preview</p>
                        <p className={cn(
                            "font-bold text-surface-900 mb-1",
                            fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-xl' : 'text-base'
                        )}>
                            Insurance Policy Renewal Notice
                        </p>
                        <p className={cn(
                            "text-surface-500",
                            fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'
                        )}>
                            Your motor insurance policy (GH-MOT-2024-1234) is due for renewal on March 15, 2026.
                            Please review the updated premium schedule and confirm before the grace period expires.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function ThemeOption({ name, description, value, colors }: {
    name: string;
    description: string;
    value: string;
    colors: string[];
}) {
    const currentTheme = useUiStore((s) => s.currentTheme);
    const setTheme = useUiStore((s) => s.setTheme);
    const isActive = currentTheme === value;

    return (
        <button
            onClick={() => setTheme(value as 'gold' | 'glass' | 'compact')}
            className={cn(
                "p-5 rounded-2xl border-2 text-left transition-all group",
                isActive
                    ? "border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10"
                    : "border-surface-200 hover:border-surface-300 hover:shadow-sm"
            )}
        >
            <div className="flex gap-1.5 mb-3">
                {colors.map((color, i) => (
                    <div key={i} className="w-6 h-6 rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: color }} />
                ))}
            </div>
            <p className="text-sm font-bold text-surface-900">{name}</p>
            <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{description}</p>
            {isActive && (
                <span className="inline-block mt-2 text-[9px] font-black text-primary-600 uppercase tracking-widest">Active</span>
            )}
        </button>
    );
}

function DisplayModeOption({ icon: Icon, label, active = false }: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    active?: boolean;
}) {
    return (
        <button
            className={cn(
                "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                active
                    ? "border-primary-500 bg-primary-50"
                    : "border-surface-200 hover:border-surface-300"
            )}
        >
            <Icon size={24} className={active ? "text-primary-600" : "text-surface-400"} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-surface-600">{label}</span>
        </button>
    );
}
