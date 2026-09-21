export const MAJOR_HEAD_OPTIONS = [
    { value: 'Personal', label: 'Personal' },
    { value: 'Professional', label: 'Professional' },
] as const;

export type MajorHead = (typeof MAJOR_HEAD_OPTIONS)[number]['value'];

export const MINOR_HEAD_MAP: Record<
    MajorHead,
    { value: string; label: string }[]
> = {
    Personal: [
        { value: 'John', label: 'John' },
        { value: 'Tom', label: 'Tom' },
        { value: 'Emily', label: 'Emily' },
    ],
    Professional: [
        { value: 'Accounts', label: 'Accounts' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'IT', label: 'IT' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Legal', label: 'Legal' },
    ],
};