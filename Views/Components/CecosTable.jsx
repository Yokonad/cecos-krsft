import { CECOSStatusLabels, CECOSStatusColors } from '../utils/constants';
import Badge from './ui/Badge';

export default function CecosTable({
  cecos,
  loading,
  onEdit,
  onDelete,
  onPageChange,
  currentPage,
  totalPages,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded border border-gray-300 bg-white shadow-sm">
        <svg className="size-8 animate-spin text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="mt-4 text-sm text-gray-500">Cargando centros de costo...</p>
      </div>
    );
  }

  if (cecos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded border border-gray-300 bg-white shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-16 text-gray-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
        </svg>
        <p className="mt-4 text-sm font-medium text-gray-900">No hay centros de costo</p>
        <p className="mt-1 text-sm text-gray-500">Crea el primer centro de costo con el botón de arriba.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900">Código</th>
            <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900">Descripción</th>
            <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap text-gray-900">Estado</th>
            <th className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cecos.map((ceco) => (
            <tr key={ceco.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{ceco.codigo}</td>
              <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{ceco.nombre}</td>
              <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{ceco.descripcion || <span className="text-gray-300">—</span>}</td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                <Badge color={CECOSStatusColors[ceco.estado]}>
                  {CECOSStatusLabels[ceco.estado]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <div className="inline-flex">
                  <button
                    onClick={() => onEdit(ceco)}
                    className="rounded-l-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Deseas eliminar este centro de costo?')) onDelete(ceco.id);
                    }}
                    className="-ml-px rounded-r-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:z-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-gray-500">Página {currentPage} de {totalPages}</p>
          <ul className="flex gap-1 text-gray-900">
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none rtl:rotate-180"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
            <li className="grid size-8 place-content-center rounded border border-teal-600 bg-teal-600 text-center text-sm font-medium text-white">
              {currentPage}
            </li>
            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                className="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none rtl:rotate-180"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="size-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
