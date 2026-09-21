import type { UseQueryResult } from '@tanstack/react-query';

import type { SearchDocumentResponse } from '@/api/schemas/document.schema';
import { apiClient } from '@/api/client';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/lib/toast';

import { VirtualizedResultList } from './VirtualizedResultList';

interface SearchResultsProps {
    query: UseQueryResult<SearchDocumentResponse, Error>;
}

export function SearchResults({ query }: SearchResultsProps) {
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch,
    } = query;

    if (isLoading) {
        return (
            <div
                className="flex flex-col items-center justify-center gap-3 py-12"
                aria-busy="true"
                aria-live="polite"
            >
                <Spinner size="lg" />
                <p className="text-sm text-gray-500">Searching documents...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div role="alert">
                <EmptyState
                    title="Search failed"
                    message={error.message || 'Something went wrong. Please try again.'}
                    action={
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    }
                />
            </div>
        );
    }

    if (!data) {
        return (
            <EmptyState
                title="Start searching"
                message="Use the filters above to search for documents."
            />
        );
    }

    if (data.data.length === 0) {
        return (
            <EmptyState
                title="No documents found"
                message="Try adjusting your filters or search term."
            />
        );
    }

    async function handleDownloadAll() {
        const documents = data.data.filter((document) => document.file_url);

        if (documents.length === 0) {
            toast.error('No downloadable files in results.');
            return;
        }

        const toastId = toast.loading(
            `Building ZIP for ${documents.length} files...`
        );

        try {
            const files = await Promise.all(
                documents.map(async (document) => {
                    const response = await apiClient.get(document.file_url!, {
                        responseType: 'arraybuffer',
                    });

                    return {
                        name: document.file_name ?? `file-${document.id}`,
                        data: response.data as ArrayBuffer,
                    };
                })
            );

            const worker = new Worker(
                new URL('../../../workers/zip.worker.ts', import.meta.url),
                { type: 'module' }
            );

            worker.postMessage({ files });

            worker.onmessage = (event: MessageEvent) => {
                toast.dismiss(toastId);

                if (event.data.type === 'done') {
                    const url = URL.createObjectURL(
                        new Blob([event.data.data], {
                            type: 'application/zip',
                        })
                    );

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `docs-${Date.now()}.zip`;
                    link.click();

                    URL.revokeObjectURL(url);
                    toast.success('ZIP downloaded!');
                } else {
                    toast.error(`ZIP failed: ${event.data.error}`);
                }

                worker.terminate();
            };
        } catch {
            toast.dismiss(toastId);
            toast.error('Failed to build ZIP.');
        }
    }

    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                        {data.recordsTotal.toLocaleString()}{' '}
                        {data.recordsTotal === 1 ? 'result' : 'results'}
                    </span>

                    {isFetching && <Spinner size="sm" />}
                </div>

                <button
                    type="button"
                    onClick={handleDownloadAll}
                    disabled={data.data.length === 0}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Download All as ZIP
                </button>
            </div>

            <VirtualizedResultList items={data.data} />
        </div>
    );
}