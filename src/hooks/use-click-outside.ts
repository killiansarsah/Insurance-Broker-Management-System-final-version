import { useEffect, useRef, useCallback } from 'react';

export function useClickOutside<T extends HTMLElement>(handler: () => void) {
    const ref = useRef<T>(null);
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handlerRef.current();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, []);

    return ref;
}
