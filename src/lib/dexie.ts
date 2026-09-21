import Dexie, { type EntityTable } from 'dexie';
import type {
    SearchDocumentRequest,
    SearchDocumentResponse,
} from '@/api/schemas/document.schema';

interface CacheEntry {
    id: string;
    params: SearchDocumentRequest;
    results: SearchDocumentResponse;
    cachedAt: number;
}

class DMSDb extends Dexie {
    cache!: EntityTable<CacheEntry, 'id'>;

    constructor() {
        super('DMSDb');

        this.version(1).stores({
            cache: 'id, cachedAt',
        });
    }
}

export const db = new DMSDb();

function getCacheKey(params: SearchDocumentRequest): string {
    return encodeURIComponent(JSON.stringify(params));
}

const CACHE_TTL = 10 * 60 * 1000;

export async function getCachedResults(
    params: SearchDocumentRequest
): Promise<SearchDocumentResponse | null> {
    const id = getCacheKey(params);
    const entry = await db.cache.get(id);

    if (!entry) {
        return null;
    }

    if (Date.now() - entry.cachedAt > CACHE_TTL) {
        await db.cache.delete(id);
        return null;
    }

    return entry.results;
}

export async function setCachedResults(
    params: SearchDocumentRequest,
    results: SearchDocumentResponse
): Promise<void> {
    const id = getCacheKey(params);

    await db.cache.put({
        id,
        params,
        results,
        cachedAt: Date.now(),
    });
}