import { describe, it, expect } from 'vitest';
import { toApiDate, fromApiDate, formatDisplayDate } from './date.utils';

describe('Date Utilities', () => {
    describe('toApiDate', () => {
        it('formats Date object into DD-MM-YYYY string', () => {
            const date = new Date(2024, 1, 12);
            expect(toApiDate(date)).toBe('12-02-2024');
        });
    });

    describe('fromApiDate', () => {
        it('parses valid DD-MM-YYYY string into a Date object', () => {
            const parsed = fromApiDate('12-02-2024');
            expect(parsed).not.toBeNull();
            expect(parsed?.getFullYear()).toBe(2024);
            expect(parsed?.getMonth()).toBe(1);
            expect(parsed?.getDate()).toBe(12);
        });

        it('returns null for empty strings or invalid dates', () => {
            expect(fromApiDate('')).toBeNull();
            expect(fromApiDate('invalid-date')).toBeNull();
            expect(fromApiDate('99-99-9999')).toBeNull();
        });
    });

    describe('formatDisplayDate', () => {
        it('formats API date string into readable DD MMM YYYY', () => {
            expect(formatDisplayDate('12-02-2024')).toBe('12 Feb 2024');
        });

        it('returns original string if parsing fails', () => {
            expect(formatDisplayDate('bad-date-format')).toBe('bad-date-format');
            expect(formatDisplayDate('')).toBe('');
        });
    });
});
