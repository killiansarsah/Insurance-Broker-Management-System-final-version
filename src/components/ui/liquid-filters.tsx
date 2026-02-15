'use client';

export function LiquidFilters() {
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
            <defs>
                <filter id="liquid-glass">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite operator="in" in2="SourceGraphic" />
                </filter>

                <filter id="liquid-hover">
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
                    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G" />
                </filter>

                <filter id="glass-refraction">
                    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="discrete" tableValues="0 1" />
                        <feFuncG type="discrete" tableValues="0 1" />
                        <feFuncB type="discrete" tableValues="0 1" />
                    </feComponentTransfer>
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
                </filter>
            </defs>
        </svg>
    );
}
