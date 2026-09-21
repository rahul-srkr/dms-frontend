import { FileUploadForm } from '@/components/upload/FileUploadForm';

export function UploadPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Upload Document
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Upload images or PDF files with metadata for easy retrieval.
                </p>
            </div>

            <FileUploadForm />
        </div>
    );
}