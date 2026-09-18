import { apiClient } from './client';
import {
    GenerateOTPRequestSchema,
    ValidateOTPRequestSchema,
    ValidateOTPResponseSchema,
    type GenerateOTPRequest,
    type ValidateOTPRequest,
    type ValidateOTPResponse,
} from './schemas/auth.schema';

export async function generateOTP(
    payload: GenerateOTPRequest
): Promise<{ success: boolean; message?: string }> {
    GenerateOTPRequestSchema.parse(payload);

    const { data } = await apiClient.post('/generateOTP', payload);

    if (data?.status === false) {
        throw new Error(data.data || 'Failed to generate OTP');
    }

    return {
        success: true,
        message: data?.data,
    };
}

export async function validateOTP(
    payload: ValidateOTPRequest
): Promise<ValidateOTPResponse> {
    ValidateOTPRequestSchema.parse(payload);

    const { data } = await apiClient.post('/validateOTP', payload);

    if (data?.status === false) {
        throw new Error(data.data || 'Invalid OTP');
    }

    return ValidateOTPResponseSchema.parse(data);
}