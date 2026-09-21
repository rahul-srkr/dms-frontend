import { z } from 'zod';

export const DocumentTagSchema = z.object({
    tag_name: z.string(),
});

export const DocumentTagsResponseSchema = z.array(DocumentTagSchema);

export type DocumentTag = z.infer<typeof DocumentTagSchema>;