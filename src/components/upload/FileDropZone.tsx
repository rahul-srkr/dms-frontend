import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';

import {
    formatFileSize,
    isAcceptedFileType,
    isFileSizeValid,
} from '@/utils/file.utils';

interface FileDropZoneProps {
    value: File | null;
    onChange: (file: File | null) => void;
    error?: string;
}

export function FileDropZone({
    value,
    onChange,
    error,
}: FileDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dropError, setDropError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFile(file: File) {
        setDropError('');

        if (!isAcceptedFileType(file)) {
            setDropError(
                'Only image (JPEG, PNG, GIF, WebP) and PDF files are allowed.'
            );
            return;
        }

        if (!isFileSizeValid(file)) {
            setDropError('File must be under 10 MB.');
            return;
        }

        onChange(file);
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];

        if (file) {
            handleFile(file);
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            handleFile(file);
        }
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
        }
    }

    function removeFile(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        onChange(null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const displayError = error || dropError;

    return (
        <div>
            <div
                role="button"
                tabIndex={0}
                aria-label="Upload file — click or drag and drop"
                onClick={() => inputRef.current?.click()}
                onKeyDown={handleKeyDown}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-6 transition ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : displayError
                            ? 'border-red-400 bg-red-50'
                            : value
                                ? 'border-green-400 bg-green-50'
                                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleInputChange}
                    className="hidden"
                    tabIndex={-1}
                />

                {value ? (
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${value.type.includes('pdf')
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-green-100 text-green-600'
                                }`}
                        >
                            {value.type.includes('pdf') ? 'PDF' : 'IMG'}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p
                                className="truncate text-sm font-medium text-gray-900"
                                title={value.name}
                            >
                                {value.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {formatFileSize(value.size)}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={removeFile}
                            className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-red-600"
                            aria-label="Remove file"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-3 text-gray-400">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>

                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-blue-600">
                                Click to upload
                            </span>{' '}
                            or drag & drop
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            JPEG, PNG, GIF, WebP, PDF — max 10 MB
                        </p>
                    </div>
                )}
            </div>

            {displayError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                    {displayError}
                </p>
            )}
        </div>
    );
}