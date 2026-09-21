import { Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '@/pages/LoginPage';
import { SearchPage } from '@/pages/SearchPage';
import { UploadPage } from '@/pages/UploadPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { AdminPage } from '@/pages/AdminPage';

export function AppRouter() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <AppShell />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/search" replace />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="admin" element={<AdminPage />} />
            </Route>

            {/* Unknown routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}