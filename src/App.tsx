import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';
import { toastConfig } from '@/lib/toast';
import { AuthProvider } from '@/context/AuthContext';
import { AppRouter } from '@/router';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster toastOptions={toastConfig} />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
