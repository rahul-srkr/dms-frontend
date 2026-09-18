import { z } from 'zod';

export const GenerateOTPRequestSchema = z.object({
    mobile_number: z.string().min(10).max(15),
});

export const ValidateOTPRequestSchema = z.object({
    mobile_number: z.string().min(10),
    otp: z.string().length(6),
});

export const ValidateOTPResponseSchema = z.object({
    token: z.string(),
});

export type GenerateOTPRequest = z.infer<typeof GenerateOTPRequestSchema>;
export type ValidateOTPRequest = z.infer<typeof ValidateOTPRequestSchema>;
export type ValidateOTPResponse = z.infer<typeof ValidateOTPResponseSchema>;
