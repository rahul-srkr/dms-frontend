import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OTPLoginForm } from './OtpLoginForm';
import * as useAuthHook from '@/hooks/useAuth';
import * as router from 'react-router-dom';

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

describe('OTPLoginForm', () => {
    const mockNavigate = vi.fn();
    const mockGenerateOTP = { mutateAsync: vi.fn(), isPending: false };
    const mockValidateOTP = { mutateAsync: vi.fn(), isPending: false };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate);

        vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
            generateOTP: mockGenerateOTP as any,
            validateOTP: mockValidateOTP as any,
            isAuthenticated: false,
            user: null,
            logout: vi.fn(),
        });
    });

    it('renders mobile step initially', () => {
        render(<OTPLoginForm />);
        expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument();
    });

    it('shows error for invalid mobile number length', async () => {
        const user = userEvent.setup();
        render(<OTPLoginForm />);

        const input = screen.getByLabelText(/mobile number/i);
        await user.type(input, '12345');
        await user.click(screen.getByRole('button', { name: /send otp/i }));

        expect(screen.getByText(/enter a valid 10-digit mobile number/i)).toBeInTheDocument();
        expect(mockGenerateOTP.mutateAsync).not.toHaveBeenCalled();
    });

    it('progresses to OTP step after valid mobile submission', async () => {
        const user = userEvent.setup();
        render(<OTPLoginForm />);

        const input = screen.getByLabelText(/mobile number/i);
        await user.type(input, '9876543210');
        await user.click(screen.getByRole('button', { name: /send otp/i }));

        expect(mockGenerateOTP.mutateAsync).toHaveBeenCalledWith({ mobile_number: '9876543210' });

        expect(await screen.findByLabelText(/enter otp/i)).toBeInTheDocument();
    });

    it('redirects if user is already authenticated', () => {
        vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
            generateOTP: mockGenerateOTP as any,
            validateOTP: mockValidateOTP as any,
            isAuthenticated: true,
            user: null,
            logout: vi.fn(),
        });

        render(<OTPLoginForm />);
        expect(mockNavigate).toHaveBeenCalledWith('/search', { replace: true });
    });
});
