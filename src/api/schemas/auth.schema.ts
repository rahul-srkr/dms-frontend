import { z } from 'zod';

export const GenerateOTPRequestSchema = z.object({
    mobile_number: z.string().min(10).max(15),
});

export const ValidateOTPRequestSchema = z.object({
    mobile_number: z.string().min(10).max(15),
    otp: z.string().length(6),
});

export const UserRoleSchema = z.object({
    id: z.number(),
    role: z.string(),
    role_slug: z.string(),
    home: z.string(),
});

export const ValidateOTPResponseSchema = z.object({
    status: z.boolean(),
    data: z.object({
        token: z.string(),
        user_id: z.string(),
        user_name: z.string(),
        roles: z.array(UserRoleSchema),
    }),
});

export type GenerateOTPRequest = z.infer<typeof GenerateOTPRequestSchema>;
export type ValidateOTPRequest = z.infer<typeof ValidateOTPRequestSchema>;
export type ValidateOTPResponse = z.infer<typeof ValidateOTPResponseSchema>;