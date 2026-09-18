import { OTPLoginForm } from '@/components/auth/OtpLoginForm';

export function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <OTPLoginForm />
        </main>
    );
}