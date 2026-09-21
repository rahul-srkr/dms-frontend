import { apiClient } from './client';
import {
    SearchDocumentRequestSchema,
    SearchDocumentResponseSchema,
    type SearchDocumentRequest,
    type SearchDocumentResponse,
    type UploadDocumentRequest,
} from './schemas/document.schema';

export async function saveDocumentEntry(
    payload: UploadDocumentRequest
): Promise<void> {
    const formData = new FormData();

    formData.append('file', payload.file);

    formData.append(
        'data',
        JSON.stringify({
            major_head: payload.major_head,
            minor_head: payload.minor_head,
            document_date: payload.document_date,
            document_remarks: payload.document_remarks,
            tags: payload.tags,
            user_id: payload.user_id,
        })
    );

    await apiClient.post('/saveDocumentEntry', formData);
}

export async function searchDocumentEntry(
    params: SearchDocumentRequest
): Promise<SearchDocumentResponse> {
    SearchDocumentRequestSchema.parse(params);

    const { data } = await apiClient.post(
        '/searchDocumentEntry',
        params
    );

    return SearchDocumentResponseSchema.parse(data);
}