import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { searchDocumentEntry } from '@/api/document.api'
import type { SearchDocumentRequest } from '@/api/schemas/document.schema';
import { queryKeys } from '@/constants/queryKeys';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getCachedResults, setCachedResults } from '@/lib/dexie';

export interface SearchFilters {
    majorHead: string;
    minorHead: string;
    fromDate: string;
    toDate: string;
    tags: string[];
    search: string;
}

const PAGE_SIZE = 20;

export function useDocumentSearch() {
    const [urlParams, setUrlParams] = useSearchParams();
    const [page, setPage] = useState(0);
    const isOnline = useOnlineStatus();

    const searchParams: SearchFilters = {
        majorHead: urlParams.get('major_head') ?? '',
        minorHead: urlParams.get('minor_head') ?? '',
        fromDate: urlParams.get('from_date') ?? '',
        toDate: urlParams.get('to_date') ?? '',
        tags: urlParams.get('tags')?.split(',').filter(Boolean) ?? [],
        search: urlParams.get('search') ?? '',
    };

    function setSearchParams(filters: SearchFilters) {
        const params = new URLSearchParams();

        if (filters.majorHead) {
            params.set('major_head', filters.majorHead);
        }

        if (filters.minorHead) {
            params.set('minor_head', filters.minorHead);
        }

        if (filters.fromDate) {
            params.set('from_date', filters.fromDate);
        }

        if (filters.toDate) {
            params.set('to_date', filters.toDate);
        }

        if (filters.tags.length > 0) {
            params.set('tags', filters.tags.join(','));
        }

        if (filters.search) {
            params.set('search', filters.search);
        }

        setUrlParams(params);
        setPage(0);
    }

    const apiParams: SearchDocumentRequest = {
        major_head: searchParams.majorHead,
        minor_head: searchParams.minorHead,
        from_date: searchParams.fromDate,
        to_date: searchParams.toDate,
        tags: searchParams.tags.map((tag) => ({
            tag_name: tag,
        })),
        search: {
            value: searchParams.search,
        },
        start: page * PAGE_SIZE,
        length: PAGE_SIZE,
        uploaded_by: '',
        filterId: '',
    };

    const hasFilters = Object.values(searchParams).some((value) =>
        Array.isArray(value) ? value.length > 0 : Boolean(value)
    );

    const query = useQuery({
        queryKey: queryKeys.documents.search(apiParams),
        queryFn: async () => {
            if (!isOnline) {
                const cached = await getCachedResults(apiParams);

                if (cached) {
                    return cached;
                }

                throw new Error('Offline: no cached results for this search.');
            }

            const results = await searchDocumentEntry(apiParams);

            await setCachedResults(apiParams, results);

            return results;
        },
        enabled: hasFilters,
        placeholderData: keepPreviousData,
    });

    function goToPage(pageNumber: number) {
        setPage(pageNumber);
    }

    return {
        searchParams,
        setSearchParams,
        query,
        page,
        goToPage,
        PAGE_SIZE,
        hasFilters,
    };
}