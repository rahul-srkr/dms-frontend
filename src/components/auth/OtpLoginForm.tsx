import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/lib/toast';

export function OTPLoginForm() {
    const navigate = useNavigate();
    const { generateOTP, validateOTP, isAuthenticated } = useAuth();

    const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    const otpRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/search', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (countdown === 0) return;

        const timer = setInterval(() => {
            setCountdown((time) => time - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    useEffect(() => {
        if (step === 'otp') {
            otpRef.current?.focus();
        }
    }, [step]);

    const formatMobileNumber = (value: string) => {
        return value.replace(/\D/g, '').slice(0, 10);
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mobile.length !== 10) {
            setError('Enter a valid 10-digit mobile number');
            return;
        }

        try {
            await generateOTP.mutateAsync({
                mobile_number: mobile,
            });

            setStep('otp');
            setCountdown(60);
            setError('');

            toast.success('OTP sent successfully');
        } catch (error: any) {
            setError(error?.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError('Enter a valid 6-digit OTP');
            return;
        }

        try {
            await validateOTP.mutateAsync({
                mobile_number: mobile,
                otp,
            });

            navigate('/search', { replace: true });
        } catch (error: any) {
            setError(error?.message || 'Invalid OTP');
            setOtp('');
            otpRef.current?.focus();
        }
    };

    const handleResendOTP = async () => {
        try {
            await generateOTP.mutateAsync({
                mobile_number: mobile,
            });

            setCountdown(60);
            setError('');

            toast.success('OTP resent successfully');
        } catch (error: any) {
            setError(error?.message || 'Failed to resend OTP');
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            {/* Brand */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    DocVault
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Document Management System
                </p>
            </div>

            {/* Steps */}
            <div className="mb-8 flex items-center">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        1
                    </span>

                    <span className="text-sm font-medium text-gray-900">
                        Mobile
                    </span>
                </div>

                <div className="mx-4 h-px flex-1 bg-gray-300" />

                <div className="flex items-center gap-2">
                    <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step === 'otp'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        2
                    </span>

                    <span
                        className={`text-sm font-medium ${step === 'otp'
                                ? 'text-gray-900'
                                : 'text-gray-500'
                            }`}
                    >
                        OTP
                    </span>
                </div>
            </div>

            {/* Mobile Step */}
            {step === 'mobile' && (
                <form onSubmit={handleSendOTP} className="space-y-5">
                    <div>
                        <label
                            htmlFor="mobile"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Mobile Number
                        </label>

                        <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                            <span className="flex items-center border-r bg-gray-50 px-4 text-gray-600">
                                +91
                            </span>

                            <input
                                id="mobile"
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                value={mobile}
                                onChange={(e) => {
                                    setMobile(formatMobileNumber(e.target.value));
                                    setError('');
                                }}
                                className="w-full px-4 py-3 outline-none"
                                placeholder="Enter 10-digit number"
                            />
                        </div>

                        {error && (
                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={generateOTP.isPending}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {generateOTP.isPending ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                            OTP sent to <strong>+91 {mobile}</strong>
                        </span>

                        <button
                            type="button"
                            onClick={() => {
                                setStep('mobile');
                                setOtp('');
                                setError('');
                            }}
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            Change
                        </button>
                    </div>

                    <div>
                        <label
                            htmlFor="otp"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Enter OTP
                        </label>

                        <input
                            ref={otpRef}
                            id="otp"
                            type="tel"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => {
                                setOtp(
                                    e.target.value.replace(/\D/g, '').slice(0, 6)
                                );
                                setError('');
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="000000"
                        />

                        {error && (
                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="text-center text-sm text-gray-500">
                        {countdown > 0 ? (
                            <span>Resend in {countdown}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={generateOTP.isPending}
                                className="font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={validateOTP.isPending || otp.length !== 6}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {validateOTP.isPending
                            ? 'Verifying...'
                            : 'Verify & Login'}
                    </button>
                </form>
            )}
        </div>
    );
}