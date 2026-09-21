import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileUploadForm } from './FileUploadForm';
import * as AuthContext from '@/context/AuthContext';
import * as ReactQuery from '@tanstack/react-query';

vi.mock('@/context/AuthContext', () => ({
    useAuthContext: vi.fn(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@tanstack/react-query')>();
    return {
        ...actual,
        useMutation: vi.fn(),
        useQueryClient: vi.fn(),
        useQuery: vi.fn(),
    };
});

describe('FileUploadForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(AuthContext, 'useAuthContext').mockReturnValue({
            user: { mobile: '9876543210' },
            isAuthenticated: true,
            login: vi.fn(),
            logout: vi.fn(),
        } as any);

        vi.spyOn(ReactQuery, 'useMutation').mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
        } as any);

        vi.spyOn(ReactQuery, 'useQueryClient').mockReturnValue({
            invalidateQueries: vi.fn(),
        } as any);

        vi.spyOn(ReactQuery, 'useQuery').mockReturnValue({
            data: [],
            isLoading: false
        } as any);
    });

    it('renders all form sections', () => {
        render(<FileUploadForm />);

        expect(screen.getByText('Document File')).toBeInTheDocument();
        expect(screen.getByText('Classification')).toBeInTheDocument();
        expect(screen.getByText('Document Date')).toBeInTheDocument();
        expect(screen.getAllByText(/Tags/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Remarks/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Upload Document/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting an empty form', async () => {
        const user = userEvent.setup();
        render(<FileUploadForm />);

        const submitButton = screen.getByRole('button', { name: /Upload Document/i });
        await user.click(submitButton);

        expect(screen.getByText('Please select a file to upload')).toBeInTheDocument();
        expect(screen.getByText('Please select a category')).toBeInTheDocument();
        expect(screen.getByText('Please select a sub-category')).toBeInTheDocument();
        expect(screen.getByText('Please select a document date')).toBeInTheDocument();
        expect(screen.getByText('Please add at least one tag')).toBeInTheDocument();
    });
});
