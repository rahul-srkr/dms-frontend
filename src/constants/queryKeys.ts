import type { SearchDocumentRequest } from '@/api/schemas/document.schema';

export const queryKeys = {
    documents: {
        all: () => ['documents'] as const,
        search: (params: Partial<SearchDocumentRequest>) =>
            ['documents', 'search', params] as const,
    },

    tags: {
        all: () => ['tags'] as const,
        search: (term: string) => ['tags', 'search', term] as const,
    },
};