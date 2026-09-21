import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { DocumentResult } from '@/api/schemas/document.schema';
import { ResultCard } from './ResultCard';

interface VirtualizedResultListProps {
  items: DocumentResult[];
}

export function VirtualizedResultList({
  items,
}: VirtualizedResultListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-y-auto"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: virtualizer.getTotalSize(),
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${item.start}px)`,
            }}
          >
            <ResultCard item={items[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}