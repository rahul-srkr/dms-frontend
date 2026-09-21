export const ACCEPTED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function isAcceptedFileType(file: File): boolean {
    return ACCEPTED_FILE_TYPES.includes(file.type);
}

export function isFileSizeValid(file: File): boolean {
    return file.size <= MAX_FILE_SIZE;
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() ?? '';
}

export function isPdfFile(fileType: string): boolean {
    return fileType.includes('pdf');
}

export function isImageFile(fileType: string): boolean {
    return fileType.startsWith('image/');
}