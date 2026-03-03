import { TableCellsIcon } from '@heroicons/react/24/outline';

export default function CecosTabBar({ counts }) {
  return (
    <div className="flex flex-wrap gap-6 border-b border-gray-200" role="tablist" aria-label="Vistas de centros de costo">
      <button
        key="all"
        role="tab"
        aria-selected={true}
        className="inline-flex items-center gap-2 px-1 py-3 text-xs font-semibold tracking-wide transition-colors border-b-2 -mb-[1px] border-blue-500 text-blue-600"
      >
        <TableCellsIcon className="size-4 shrink-0" />
        JERARQUÍA
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {counts.total}
        </span>
      </button>
    </div>
  );
}
