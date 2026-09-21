import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function AppShell() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isOnline = useOnlineStatus();

    return (
        <div className="min-h-screen bg-gray-50">
            {!isOnline && (
                <div
                    role="alert"
                    className="flex items-center justify-center gap-2 bg-yellow-100 px-4 py-2 text-sm text-yellow-800"
                >
                    <span>⚠</span>
                    You are offline. Showing cached results where available.
                </div>
            )}

            <Header
                onMenuToggle={() => setSidebarOpen((open) => !open)}
            />

            <div className="flex">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <main id="main-content" className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}