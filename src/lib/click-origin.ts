/**
 * Global click-origin tracker.
 * Records the (x, y) of the last mousedown anywhere in the document.
 * Used by Modal / ConfirmationModal to compute the Samsung One UI-style
 * origin-expand transform-origin so modals appear to grow from the
 * button the user tapped.
 */

if (typeof window !== 'undefined') {
    window.addEventListener(
        'mousedown',
        (e: MouseEvent) => {
            (window as any).__ibmsLastClick = { x: e.clientX, y: e.clientY }
        },
        { capture: true, passive: true }
    )
}

export function getLastClickOrigin(): { x: number; y: number } {
    if (typeof window === 'undefined') return { x: 0, y: 0 }
    return (window as any).__ibmsLastClick ?? {
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    }
}
