import { apiClient } from './client';
import {
    DocumentTagsResponseSchema,
    type DocumentTag,
} from './schemas/tags.schema';

export async function fetchDocumentTags(
    term: string
): Promise<DocumentTag[]> {
    const { data } = await apiClient.post('/documentTags', {
        term,
    });

    return DocumentTagsResponseSchema.parse(data.data);
}