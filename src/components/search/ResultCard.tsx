import { useState } from 'react';

import { apiClient } from '@/api/client';
import type { DocumentResult } from '@/api/schemas/document.schema';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/lib/toast';
import { formatDisplayDate } from '@/utils/date.utils';
import {
    isImageFile,
    isPdfFile,
} from '@/utils/file.utils';

import { FilePreviewModal } from '@/components/preview/FilePreviewModal';

interface ResultCardProps {
    item: DocumentResult;
}

export function ResultCard({ item }: ResultCardProps) {
    const [showPreview, setShowPreview] = useState(false);

    const isPdf = isPdfFile(item.file_type ?? '');
    const isImage = isImageFile(item.file_type ?? '');

    async function handleDownload() {
        if (!item.file_url) {
            toast.error('Download URL not available.');
            return;
        }

        try {
            const response = await apiClient.get(item.file_url, {
                responseType: 'blob',
            });

            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');

            link.href = url;
            link.download = item.file_name ?? `document-${item.id}`;
            link.click();

            URL.revokeObjectURL(url);
        } catch {
            toast.error('Download failed.');
        }
    }

    return (
        <>
            <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isPdf
                            ? 'bg-red-100 text-red-600'
                            : isImage
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    {isPdf ? 'PDF' : isImage ? 'IMG' : 'FILE'}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p
                                className="truncate font-medium text-gray-900"
                                title={item.file_name}
                            >
                                {item.file_name ?? `Document ${item.id}`}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                <Badge variant="default">
                                    {item.major_head}
                                </Badge>

                                <span>›</span>

                                <Badge variant="default">
                                    {item.minor_head}
                                </Badge>

                                <span>·</span>

                                <span>
                                    {formatDisplayDate(item.document_date)}
                                </span>

                                {item.uploaded_by && (
                                    <>
                                        <span>·</span>
                                        <span>by {item.uploaded_by}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 gap-1">
                            <button
                                type="button"
                                onClick={() => setShowPreview(true)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                aria-label="Preview document"
                                title="Preview"
                            >
                                👁
                            </button>

                            <button
                                type="button"
                                onClick={handleDownload}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                aria-label="Download document"
                                title="Download"
                            >
                                ↓
                            </button>
                        </div>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {item.tags.slice(0, 5).map((tag) => (
                                <Badge key={tag.tag_name} variant="primary">
                                    #{tag.tag_name}
                                </Badge>
                            ))}

                            {item.tags.length > 5 && (
                                <span className="px-2 py-1 text-xs text-gray-500">
                                    +{item.tags.length - 5}
                                </span>
                            )}
                        </div>
                    )}

                    {item.document_remarks && (
                        <p
                            className="mt-3 truncate text-sm text-gray-600"
                            title={item.document_remarks}
                        >
                            {item.document_remarks}
                        </p>
                    )}
                </div>
            </div>

            {showPreview && (
                <FilePreviewModal
                    doc={item}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </>
    );
}