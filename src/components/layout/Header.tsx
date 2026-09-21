import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
    '/upload': 'Upload Document',
    '/search': 'Search Documents',
    '/admin': 'Admin Panel',
};

interface HeaderProps {
    onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
    const { pathname } = useLocation();
    const title = pageTitles[pathname] || 'Document Management';

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenuToggle}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Toggle navigation menu"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                </h2>
            </div>

            <div
                className="h-3 w-3 rounded-full bg-green-500"
                title="API Connected"
            />
        </header>
    );
}