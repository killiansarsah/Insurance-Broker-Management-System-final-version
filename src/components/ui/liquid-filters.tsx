'use client';

export function LiquidFilters() {
    return (
        <svg className="hidden">
            <defs>
                <filter id="liquid-glass">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -20"
                        result="goo"
                    />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>

                <filter id="liquid-glass-refraction">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="3" result="noise" seed="1">
                        <animate attributeName="baseFrequency" values="0.01 0.01;0.02 0.01;0.01 0.01" dur="15s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </defs>
        </svg>
    );
}
