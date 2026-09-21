import { z } from 'zod';

import {
    ACCEPTED_FILE_TYPES,
    MAX_FILE_SIZE,
} from '@/utils/file.utils';

export const TagSchema = z.object({
    tag_name: z.string().min(1),
});

export const UploadDocumentRequestSchema = z.object({
    file: z
        .instanceof(File)
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            'File must be under 10 MB'
        )
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            'Only image and PDF files are allowed'
        ),

    major_head: z.string().min(1, 'Category is required'),

    minor_head: z.string().min(1, 'Sub-category is required'),

    document_date: z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, 'Use DD-MM-YYYY format'),

    document_remarks: z.string().max(500).default(''),

    tags: z.array(TagSchema).max(10).default([]),

    user_id: z.string().min(1),
});

export const SearchDocumentRequestSchema = z.object({
    major_head: z.string().default(''),
    minor_head: z.string().default(''),
    from_date: z.string().default(''),
    to_date: z.string().default(''),
    tags: z.array(TagSchema).default([]),
    uploaded_by: z.string().default(''),

    start: z.number().int().nonnegative().default(0),

    length: z
        .number()
        .int()
        .positive()
        .max(100)
        .default(20),

    filterId: z.string().default(''),

    search: z
        .object({
            value: z.string().default(''),
        })
        .default({ value: '' }),
});

export const DocumentResultSchema = z.object({
    document_id: z.number(),
    major_head: z.string(),
    minor_head: z.string(),
    file_url: z.string(),
    document_date: z.string(),
    document_remarks: z.string(),
    upload_time: z.string(),
    uploaded_by: z.string(),
    total_count: z.number(),
});

export const SearchDocumentResponseSchema = z.object({
    status: z.boolean(),
    data: z.array(DocumentResultSchema),
    recordsTotal: z.number(),
    recordsFiltered: z.number(),
});

export type Tag = z.infer<typeof TagSchema>;

export type UploadDocumentRequest = z.infer<
    typeof UploadDocumentRequestSchema
>;

export type SearchDocumentRequest = z.infer<
    typeof SearchDocumentRequestSchema
>;

export type DocumentResult = z.infer<
    typeof DocumentResultSchema
>;

export type SearchDocumentResponse = z.infer<
    typeof SearchDocumentResponseSchema
>;