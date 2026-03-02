import { ArrowLeftIcon, BuildingLibraryIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';

export default function CecosHeader({ onBack, onCreate }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
      <div className="flex items-center gap-4">
        <Button variant="primary" size="md" onClick={onBack} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          Volver
        </Button>

        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <span className="flex items-center justify-center rounded-xl bg-primary p-2.5">
            <BuildingLibraryIcon className="size-6 text-white" />
          </span>
          <span>
            CENTROS DE COSTO
            <p className="text-sm font-normal text-gray-500">Gestione los centros de costo y su jerarquía</p>
          </span>
        </h1>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
      >
        <PlusIcon className="size-4" />
        Nuevo Centro
      </button>
    </header>
  );
}
