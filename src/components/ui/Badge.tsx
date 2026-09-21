import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    onRemove?: () => void;
}

const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
};

export function Badge({
    children,
    variant = 'default',
    onRemove,
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${variantClasses[variant]}`}
        >
            {children}

            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-current hover:opacity-70"
                    aria-label={`Remove ${children}`}
                >
                    ×
                </button>
            )}
        </span>
    );
}