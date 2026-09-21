import { useEffect, useState } from 'react';

import { apiClient } from '@/api/client';
import type { DocumentResult } from '@/api/schemas/document.schema';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import {
    isImageFile,
    isPdfFile,
} from '@/utils/file.utils';

interface FilePreviewModalProps {
    doc: DocumentResult;
    onClose: () => void;
}

export function FilePreviewModal({
    doc,
    onClose,
}: FilePreviewModalProps) {
    const [blobUrl, setBlobUrl] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        if (!doc.file_url) {
            setLoading(false);
            setFetchError(true);
            return;
        }

        let objectUrl: string | undefined;

        setLoading(true);
        setFetchError(false);
        setBlobUrl(undefined);

        apiClient
            .get(doc.file_url, { responseType: 'blob' })
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

    const fileType = doc.file_type ?? '';

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

                    {doc.file_url && (
                        <a
                            href={doc.file_url}
                            download={doc.file_name}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Download instead
                        </a>
                    )}
                </div>
            );
        }

        if (isPdfFile(fileType)) {
            return (
                <iframe
                    src={blobUrl}
                    title={`PDF Preview: ${doc.file_name}`}
                    className="h-[70vh] w-full rounded-lg border"
                />
            );
        }

        if (isImageFile(fileType)) {
            return (
                <div className="flex max-h-[70vh] justify-center overflow-auto">
                    <img
                        src={blobUrl}
                        alt={doc.file_name}
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
                    download={doc.file_name}
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
            title={doc.file_name ?? `Document ${doc.id}`}
            size="xl"
        >
            {renderContent()}
        </Modal>
    );
}