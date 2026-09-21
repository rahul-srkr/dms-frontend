import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import { saveDocumentEntry } from '@/api/document.api';
import { getErrorMessage } from '@/api/errors';
import { queryKeys } from '@/constants/queryKeys';
import { queryClient } from '@/lib/queryClient';
import { toast } from '@/lib/toast';
import { toApiDate } from '@/utils/date.utils';
import { useAuthContext } from '@/context/AuthContext';

import { Button } from '@/components/ui/Button';
import { CategoryDropdowns } from './CategoryDropdowns';
import { FileDropZone } from './FileDropZone';
import { TagTokenInput } from './TagsTokenInput';

interface FormState {
    file: File | null;
    majorHead: string;
    minorHead: string;
    date: Date | undefined;
    tags: string[];
    remarks: string;
}

interface FormErrors {
    file?: string;
    majorHead?: string;
    minorHead?: string;
    date?: string;
    tags?: string;
}

const initialState: FormState = {
    file: null,
    majorHead: '',
    minorHead: '',
    date: undefined,
    tags: [],
    remarks: '',
};

export function FileUploadForm() {
    const { user } = useAuthContext();

    const [form, setForm] = useState<FormState>(initialState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    function validate(): FormErrors {
        const errors: FormErrors = {};

        if (!form.file) {
            errors.file = 'Please select a file to upload';
        }

        if (!form.majorHead) {
            errors.majorHead = 'Please select a category';
        }

        if (!form.minorHead) {
            errors.minorHead = 'Please select a sub-category';
        }

        if (!form.date) {
            errors.date = 'Please select a document date';
        }

        if (form.tags.length === 0) {
            errors.tags = 'Please add at least one tag';
        }

        return errors;
    }

    const uploadMutation = useMutation({
        mutationFn: saveDocumentEntry,

        onSuccess: () => {
            toast.success('Document uploaded successfully!');

            setForm(initialState);
            setErrors({});

            queryClient.invalidateQueries({
                queryKey: queryKeys.documents.all(),
            });
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        uploadMutation.mutate({
            file: form.file!,
            major_head: form.majorHead,
            minor_head: form.minorHead,
            document_date: toApiDate(form.date!),
            document_remarks: form.remarks,
            tags: form.tags.map((tag) => ({
                tag_name: tag,
            })),
            user_id: user?.mobile ?? '',
        });
    }

    function clearForm() {
        setForm(initialState);
        setErrors({});
        setShowDatePicker(false);
    }

    const dateLabel = form.date
        ? form.date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        : 'Select date...';

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-8"
            >
                <section>
                    <h3 className="mb-4 text-base font-semibold text-gray-900">
                        Document File
                    </h3>

                    <FileDropZone
                        value={form.file}
                        onChange={(file) =>
                            setForm((current) => ({
                                ...current,
                                file,
                            }))
                        }
                        error={errors.file}
                    />
                </section>

                <section>
                    <h3 className="mb-4 text-base font-semibold text-gray-900">
                        Classification
                    </h3>

                    <CategoryDropdowns
                        majorHead={form.majorHead}
                        minorHead={form.minorHead}
                        onMajorChange={(value) =>
                            setForm((current) => ({
                                ...current,
                                majorHead: value,
                                minorHead: '',
                            }))
                        }
                        onMinorChange={(value) =>
                            setForm((current) => ({
                                ...current,
                                minorHead: value,
                            }))
                        }
                        majorError={errors.majorHead}
                        minorError={errors.minorHead}
                    />
                </section>

                <section>
                    <h3 className="mb-4 text-base font-semibold text-gray-900">
                        Document Date
                    </h3>

                    <div className="relative">
                        <button
                            type="button"
                            id="document-date-picker"
                            onClick={() =>
                                setShowDatePicker((open) => !open)
                            }
                            aria-describedby={
                                errors.date ? 'date-error' : undefined
                            }
                            aria-expanded={showDatePicker}
                            aria-haspopup="dialog"
                            className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-left text-sm outline-none ${errors.date
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                }`}
                        >
                            <span>📅</span>

                            <span
                                className={
                                    form.date
                                        ? 'text-gray-900'
                                        : 'text-gray-400'
                                }
                            >
                                {dateLabel}
                            </span>
                        </button>

                        {showDatePicker && (
                            <div className="absolute z-20 mt-2 rounded-lg border bg-white p-3 shadow-lg">
                                <DayPicker
                                    mode="single"
                                    selected={form.date}
                                    onSelect={(date) => {
                                        setForm((current) => ({
                                            ...current,
                                            date: date ?? undefined,
                                        }));

                                        setShowDatePicker(false);

                                        if (errors.date) {
                                            setErrors((current) => ({
                                                ...current,
                                                date: undefined,
                                            }));
                                        }
                                    }}
                                    disabled={{ after: new Date() }}
                                />
                            </div>
                        )}
                    </div>

                    {errors.date && (
                        <p
                            id="date-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                        >
                            {errors.date}
                        </p>
                    )}
                </section>

                <section>
                    <h3 className="mb-4 text-base font-semibold text-gray-900">
                        Tags <span className="text-red-500">*</span>
                    </h3>

                    <TagTokenInput
                        value={form.tags}
                        onChange={(tags) => {
                            setForm((current) => ({
                                ...current,
                                tags,
                            }));

                            if (tags.length > 0 && errors.tags) {
                                setErrors((current) => ({
                                    ...current,
                                    tags: undefined,
                                }));
                            }
                        }}
                        error={errors.tags}
                    />
                </section>

                <section>
                    <h3 className="mb-4 text-base font-semibold text-gray-900">
                        Remarks{' '}
                        <span className="font-normal text-gray-500">
                            (optional)
                        </span>
                    </h3>

                    <div className="relative">
                        <textarea
                            id="document-remarks"
                            value={form.remarks}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    remarks: event.target.value,
                                }))
                            }
                            placeholder="Add any notes about this document..."
                            maxLength={500}
                            rows={3}
                            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />

                        <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {form.remarks.length}/500
                        </span>
                    </div>
                </section>

                <div className="flex flex-wrap gap-3 border-t pt-6">
                    <Button
                        type="submit"
                        id="btn-upload-submit"
                        variant="primary"
                        size="lg"
                        loading={uploadMutation.isPending}
                    >
                        Upload Document
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={clearForm}
                        disabled={uploadMutation.isPending}
                    >
                        Clear
                    </Button>
                </div>
            </form>
        </div>
    );
}