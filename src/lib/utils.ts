import { type ClassValue, clsx } from 'clsx';

// Lightweight class merger (no tailwind-merge dep needed with Tailwind v4)
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatCurrency(
    amount: number,
    currency = 'GHS',
    locale = 'en-GH'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(
    date: string | Date,
    style: 'short' | 'long' | 'relative' = 'short'
): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (style === 'relative') {
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
    }

    if (style === 'long') {
        return d.toLocaleDateString('en-GH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    // DD/MM/YYYY — Ghana standard
    return d.toLocaleDateString('en-GH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('233') && cleaned.length === 12) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    return phone;
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '…';
}

export function generateId(): string {
    return crypto.randomUUID();
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
