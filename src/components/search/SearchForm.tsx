import { useState, type FormEvent } from 'react';
import { MAJOR_HEAD_OPTIONS, MINOR_HEAD_MAP } from '@/constants/categories';
import { TagTokenInput } from '@/components/upload/TagsTokenInput';
import { Button } from '@/components/ui/Button';
import type { SearchFilters } from '@/hooks/useDocumentSearch';
import { toApiDate } from '@/utils/date.utils';

interface SearchFormProps {
    onSearch: (filters: SearchFilters) => void;
    initialValues?: SearchFilters;
}

const emptyFilters: SearchFilters = {
    majorHead: '',
    minorHead: '',
    fromDate: '',
    toDate: '',
    tags: [],
    search: '',
};

export function SearchForm({
    onSearch,
    initialValues,
}: SearchFormProps) {
    const [form, setForm] = useState<SearchFilters>(
        initialValues ?? emptyFilters
    );

    const minorOptions = form.majorHead
        ? MINOR_HEAD_MAP[form.majorHead] ?? []
        : [];

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        onSearch(form);
    }

    function handleReset() {
        setForm(emptyFilters);
        onSearch(emptyFilters);
    }

    function handleDateChange(
        field: 'fromDate' | 'toDate',
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value
                ? toApiDate(new Date(`${value}T00:00:00`))
                : '',
        }));
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-xl border bg-white p-5 shadow-sm"
        >
            <div className="flex flex-col gap-3 md:flex-row">
                <input
                    id="global-search"
                    type="text"
                    placeholder="Search by keyword..."
                    value={form.search}
                    onChange={(event) =>
                        setForm((current) => ({
                            ...current,
                            search: event.target.value,
                        }))
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <Button type="submit">
                    Search
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <label
                        htmlFor="search-major"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Category
                    </label>

                    <select
                        id="search-major"
                        value={form.majorHead}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                majorHead: event.target.value,
                                minorHead: '',
                            }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All categories</option>

                        {MAJOR_HEAD_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="search-minor"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Sub-category
                    </label>

                    <select
                        id="search-minor"
                        value={form.minorHead}
                        disabled={!form.majorHead}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                minorHead: event.target.value,
                            }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All sub-categories</option>

                        {minorOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="search-from-date"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        From Date
                    </label>

                    <input
                        id="search-from-date"
                        type="date"
                        value={
                            form.fromDate
                                ? form.fromDate.split('-').reverse().join('-')
                                : ''
                        }
                        onChange={(event) =>
                            handleDateChange('fromDate', event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                <div>
                    <label
                        htmlFor="search-to-date"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        To Date
                    </label>

                    <input
                        id="search-to-date"
                        type="date"
                        value={
                            form.toDate
                                ? form.toDate.split('-').reverse().join('-')
                                : ''
                        }
                        onChange={(event) =>
                            handleDateChange('toDate', event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <div className="mt-5">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Filter by Tags
                </label>

                <TagTokenInput
                    value={form.tags}
                    onChange={(tags) =>
                        setForm((current) => ({
                            ...current,
                            tags,
                        }))
                    }
                />
            </div>
        </form>
    );
}