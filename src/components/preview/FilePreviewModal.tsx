import { useEffect, useState } from 'react';

import { apiClient } from '@/api/client';
import type { DocumentResult } from '@/api/schemas/document.schema';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';

interface FilePreviewModalProps {
    doc: DocumentResult;
    onClose: () => void;
}

function getFileExtension(url: string): string {
    const path = url.split('?')[0];
    return path.split('.').pop()?.toLowerCase() ?? '';
}

export function FilePreviewModal({
    doc,
    onClose,
}: FilePreviewModalProps) {
    const [blobUrl, setBlobUrl] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        let objectUrl: string | undefined;

        setLoading(true);
        setFetchError(false);
        setBlobUrl(undefined);

        apiClient
            .get(doc.file_url, {
                responseType: 'blob',
            })
            .then((response) => {
                objectUrl = URL.createObjectURL(response.data);
                setBlobUrl(objectUrl);
            })
            .catch(() => {
                setFetchError(true);
            })
            .finally(() => {
                setLoading(false);
            });

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [doc.file_url]);

    function renderContent() {
        if (loading) {
            return (
                <div className="flex min-h-96 flex-col items-center justify-center gap-3">
                    <Spinner size="lg" />
                    <p className="text-sm text-gray-500">
                        Loading preview...
                    </p>
                </div>
            );
        }

        if (fetchError || !blobUrl) {
            return (
                <div className="flex min-h-96 flex-col items-center justify-center gap-3">
                    <p className="text-sm text-red-600">
                        Could not load preview.
                    </p>

                    <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Open file
                    </a>
                </div>
            );
        }

        const extension = getFileExtension(doc.file_url);

        if (extension === 'pdf') {
            return (
                <iframe
                    src={blobUrl}
                    title={`PDF Preview - Document ${doc.document_id}`}
                    className="h-[70vh] w-full rounded-lg border"
                />
            );
        }

        if (
            ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)
        ) {
            return (
                <div className="flex max-h-[70vh] justify-center overflow-auto">
                    <img
                        src={blobUrl}
                        alt={`Document ${doc.document_id}`}
                        className="max-h-[70vh] max-w-full object-contain"
                    />
                </div>
            );
        }

        return (
            <div className="flex min-h-96 flex-col items-center justify-center gap-3">
                <p className="text-sm text-gray-600">
                    Preview not available for this file type.
                </p>

                <a
                    href={blobUrl}
                    download
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Download to view
                </a>
            </div>
        );
    }

    return (
        <Modal
            isOpen
            onClose={onClose}
            title={`Document ${doc.document_id}`}
            size="xl"
        >
            {renderContent()}
        </Modal>
    );
}