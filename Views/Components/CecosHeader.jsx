import { ArrowLeftIcon, BuildingLibraryIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';

export default function CecosHeader({ onBack, onCreate, canCreate }) {
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

      {canCreate && (
        <Button variant="primary" size="md" onClick={onCreate} className="gap-2">
          <PlusIcon className="size-4" />
          Agregar
        </Button>
      )}
    </header>
  );
}
