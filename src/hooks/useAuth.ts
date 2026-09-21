import { useMutation } from '@tanstack/react-query';

import { generateOTP, validateOTP } from '@/api/auth.api';
import { getErrorMessage } from '@/api/errors';
import { toast } from '@/lib/toast';
import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
    const { login, logout, user, isAuthenticated } = useAuthContext();

    const generateOTPMutation = useMutation({
        mutationFn: generateOTP,
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const validateOTPMutation = useMutation({
        mutationFn: validateOTP,
        onSuccess: (data, variables) => {
            login(variables.mobile_number, data.data.token);
            toast.success('Login successful!');
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    return {
        user,
        isAuthenticated,
        logout,
        generateOTP: generateOTPMutation,
        validateOTP: validateOTPMutation,
    };
}