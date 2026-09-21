import type { ReactNode } from 'react';

interface EmptyStateProps {
    title?: string;
    message: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export function EmptyState({
    title,
    message,
    icon,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                {icon ?? (
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                )}
            </div>

            {title && (
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    {title}
                </h3>
            )}

            <p className="text-sm text-gray-500">
                {message}
            </p>

            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
}