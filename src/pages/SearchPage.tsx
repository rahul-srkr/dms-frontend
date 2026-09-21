import { SearchForm } from '@/components/search/SearchForm';
import { SearchResults } from '@/components/search/SearchResult';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';

export function SearchPage() {
    const { searchParams, setSearchParams, query } = useDocumentSearch();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Search Documents
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Filter by category, date range, or tags to find your documents.
                </p>
            </div>

            <SearchForm
                onSearch={setSearchParams}
                initialValues={searchParams}
            />

            <SearchResults query={query} />
        </div>
    );
}