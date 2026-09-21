import { z } from 'zod';

export const TagSchema = z.object({
    tag_name: z.string().min(1),
});

export const UploadDocumentRequestSchema = z.object({
    file: z
        .instanceof(File)
        .refine(
            (file) => file.size <= 10 * 1024 * 1024,
            'File must be under 10 MB'
        )
        .refine(
            (file) =>
                [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'application/pdf',
                ].includes(file.type),
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
    length: z.number().int().positive().max(100).default(20),
    filterId: z.string().default(''),
    search: z.object({
        value: z.string().default(''),
    }).default({ value: '' }),
});

export const DocumentResultSchema = z.object({
    id: z.union([z.string(), z.number()]),
    major_head: z.string(),
    minor_head: z.string(),
    document_date: z.string(),
    document_remarks: z.string().optional(),
    tags: z.array(TagSchema).optional(),
    uploaded_by: z.string().optional(),
    file_url: z.string().optional(),
    file_name: z.string().optional(),
    file_type: z.string().optional(),
});

export const SearchDocumentResponseSchema = z.object({
    data: z.array(DocumentResultSchema),
    recordsTotal: z.number(),
    recordsFiltered: z.number(),
});

export type Tag = z.infer<typeof TagSchema>;
export type UploadDocumentRequest = z.infer<typeof UploadDocumentRequestSchema>;
export type SearchDocumentRequest = z.infer<typeof SearchDocumentRequestSchema>;
export type SearchDocumentResponse = z.infer<typeof SearchDocumentResponseSchema>;
export type DocumentResult = z.infer<typeof DocumentResultSchema>;