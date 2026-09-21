import { type ChangeEvent } from 'react';

import {
    MAJOR_HEAD_OPTIONS,
    MINOR_HEAD_MAP,
} from '@/constants/categories';

interface CategoryDropdownsProps {
    majorHead: string;
    minorHead: string;
    onMajorChange: (value: string) => void;
    onMinorChange: (value: string) => void;
    majorError?: string;
    minorError?: string;
}

export function CategoryDropdowns({
    majorHead,
    minorHead,
    onMajorChange,
    onMinorChange,
    majorError,
    minorError,
}: CategoryDropdownsProps) {
    const minorOptions = majorHead
        ? MINOR_HEAD_MAP[majorHead] ?? []
        : [];

    function handleMajorChange(event: ChangeEvent<HTMLSelectElement>) {
        onMajorChange(event.target.value);
        onMinorChange('');
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {/* Category */}
            <div>
                <label
                    htmlFor="major_head"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                    Category <span className="text-red-500">*</span>
                </label>

                <select
                    id="major_head"
                    value={majorHead}
                    onChange={handleMajorChange}
                    aria-describedby={majorError ? 'major-error' : undefined}
                    aria-invalid={!!majorError}
                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none ${majorError
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                >
                    <option value="">Select category...</option>

                    {MAJOR_HEAD_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {majorError && (
                    <p
                        id="major-error"
                        className="mt-1 text-sm text-red-600"
                        role="alert"
                    >
                        {majorError}
                    </p>
                )}
            </div>

            {/* Sub-category */}
            <div>
                <label
                    htmlFor="minor_head"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                    Sub-category <span className="text-red-500">*</span>
                </label>

                <select
                    id="minor_head"
                    value={minorHead}
                    onChange={(event) => onMinorChange(event.target.value)}
                    disabled={!majorHead}
                    aria-describedby={minorError ? 'minor-error' : undefined}
                    aria-invalid={!!minorError}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none ${minorError
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        } ${!majorHead
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                >
                    <option value="">
                        {majorHead
                            ? 'Select sub-category...'
                            : 'Select category first'}
                    </option>

                    {minorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {minorError && (
                    <p
                        id="minor-error"
                        className="mt-1 text-sm text-red-600"
                        role="alert"
                    >
                        {minorError}
                    </p>
                )}
            </div>
        </div>
    );
}