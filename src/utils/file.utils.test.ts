import { describe, it, expect } from 'vitest';
import {
    formatFileSize,
    isAcceptedFileType,
    isFileSizeValid,
    getFileExtension,
    isPdfFile,
    isImageFile
} from './file.utils';

describe('File Utilities', () => {
    describe('formatFileSize', () => {
        it('formats sizes in bytes', () => {
            expect(formatFileSize(500)).toBe('500 B');
            expect(formatFileSize(1023)).toBe('1023 B');
        });

        it('formats sizes in kilobytes (KB)', () => {
            expect(formatFileSize(1024)).toBe('1.0 KB');
            expect(formatFileSize(1536)).toBe('1.5 KB');
            expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.0 KB');
        });

        it('formats sizes in megabytes (MB)', () => {
            expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
            expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
        });
    });

    describe('isAcceptedFileType', () => {
        it('accepts allowed image types and PDF', () => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
            for (const type of validTypes) {
                const file = new File([''], 'test', { type });
                expect(isAcceptedFileType(file)).toBe(true);
            }
        });

        it('rejects unsupported file types', () => {
            const invalidTypes = ['text/plain', 'application/msword', 'image/svg+xml'];
            for (const type of invalidTypes) {
                const file = new File([''], 'test', { type });
                expect(isAcceptedFileType(file)).toBe(false);
            }
        });
    });

    describe('isFileSizeValid', () => {
        it('returns true for files under or equal to 10 MB', () => {
            const file1 = new File([''], 'test');
            Object.defineProperty(file1, 'size', { value: 10 * 1024 * 1024 });
            expect(isFileSizeValid(file1)).toBe(true);

            const file2 = new File([''], 'test');
            Object.defineProperty(file2, 'size', { value: 5 * 1024 * 1024 });
            expect(isFileSizeValid(file2)).toBe(true);
        });

        it('returns false for files strictly over 10 MB', () => {
            const file = new File([''], 'test');
            Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 + 1 });
            expect(isFileSizeValid(file)).toBe(false);
        });
    });

    describe('getFileExtension', () => {
        it('extracts extensions accurately and in lowercase', () => {
            expect(getFileExtension('report.pdf')).toBe('pdf');
            expect(getFileExtension('image.JPEG')).toBe('jpeg');
            expect(getFileExtension('noextension')).toBe('noextension');
            expect(getFileExtension('.hiddenfile')).toBe('hiddenfile');
        });
    });

    describe('isPdfFile / isImageFile', () => {
        it('identifies PDFs correctly', () => {
            expect(isPdfFile('application/pdf')).toBe(true);
            expect(isPdfFile('image/jpeg')).toBe(false);
        });

        it('identifies images correctly', () => {
            expect(isImageFile('image/png')).toBe(true);
            expect(isImageFile('image/jpeg')).toBe(true);
            expect(isImageFile('application/pdf')).toBe(false);
        });
    });
});
