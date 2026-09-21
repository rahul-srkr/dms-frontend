import { format, isValid, parse } from 'date-fns';

export function toApiDate(date: Date): string {
    return format(date, 'dd-MM-yyyy');
}

export function fromApiDate(date: string): Date | null {
    if (!date) {
        return null;
    }

    const parsedDate = parse(date, 'dd-MM-yyyy', new Date());

    return isValid(parsedDate) ? parsedDate : null;
}

export function formatDisplayDate(date: string): string {
    const parsedDate = fromApiDate(date);

    if (!parsedDate) {
        return date;
    }

    return format(parsedDate, 'dd MMM yyyy');
}