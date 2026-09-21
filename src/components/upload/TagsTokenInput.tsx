import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDocumentTags } from '@/api/tags.api';
import { queryKeys } from '@/constants/queryKeys';
import { useDebounce } from '@/hooks/useDebouce';
import { Badge } from '@/components/ui/Badge';

interface TagTokenInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    error?: string;
}

const MAX_TAGS = 10;

export function TagTokenInput({
    value,
    onChange,
    error,
}: TagTokenInputProps) {
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const debouncedInput = useDebounce(input, 300);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: suggestions = [] } = useQuery({
        queryKey: queryKeys.tags.search(debouncedInput),
        queryFn: () => fetchDocumentTags(debouncedInput),
        enabled: debouncedInput.length > 0,
    });

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    function addTag(tag: string) {
        const trimmedTag = tag.trim();

        if (
            !trimmedTag ||
            value.includes(trimmedTag) ||
            value.length >= MAX_TAGS
        ) {
            return;
        }

        onChange([...value, trimmedTag]);
        setInput('');
        setIsOpen(false);
        inputRef.current?.focus();
    }

    function removeTag(tag: string) {
        onChange(value.filter((item) => item !== tag));
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (
            (event.key === 'Enter' || event.key === ',') &&
            input.trim()
        ) {
            event.preventDefault();
            addTag(input);
        }

        if (event.key === 'Backspace' && !input && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    }

    const filteredSuggestions = suggestions
        .map((tag) => tag.tag_name)
        .filter((tag) => !value.includes(tag))
        .slice(0, 8);

    return (
        <div ref={containerRef} className="relative">
            <div
                onClick={() => inputRef.current?.focus()}
                className={`flex min-h-12 flex-wrap items-center gap-2 rounded-lg border bg-white p-2 ${error
                        ? 'border-red-500'
                        : 'border-gray-300 focus-within:border-blue-500'
                    }`}
            >
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        variant="primary"
                        onRemove={() => removeTag(tag)}
                    >
                        {tag}
                    </Badge>
                ))}

                {value.length < MAX_TAGS && (
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(event) => {
                            setInput(event.target.value);
                            setIsOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (debouncedInput) {
                                setIsOpen(true);
                            }
                        }}
                        placeholder={
                            value.length === 0
                                ? 'Add tags (press Enter or comma)…'
                                : ''
                        }
                        className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm outline-none"
                    />
                )}
            </div>

            {isOpen && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-lg border bg-white py-1 shadow-lg">
                    {filteredSuggestions.map((tag) => (
                        <li
                            key={tag}
                            onMouseDown={(event) => {
                                event.preventDefault();
                                addTag(tag);
                            }}
                            className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                        >
                            #{tag}
                        </li>
                    ))}
                </ul>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}

            <p className="mt-1 text-xs text-gray-500">
                {value.length}/{MAX_TAGS} tags — Enter or comma to add
            </p>
        </div>
    );
}