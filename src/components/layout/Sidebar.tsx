import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
    { to: '/upload', label: 'Upload' },
    { to: '/search', label: 'Search' },
    { to: '/admin', label: 'Admin' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <nav
            aria-label="Main navigation"
            className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-white p-4 shadow-sm transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0`}
        >
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                    D
                </div>

                <span className="text-xl font-bold text-gray-900">
                    DocVault
                </span>
            </div>

            {/* Navigation */}
            <div className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `block rounded-lg px-4 py-3 text-sm font-medium ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>

            {/* User */}
            {user && (
                <div className="border-t pt-4">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                            {user.mobile.slice(-2)}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                                +91 {user.mobile}
                            </p>

                            <p className="text-xs text-gray-500">
                                Member
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}