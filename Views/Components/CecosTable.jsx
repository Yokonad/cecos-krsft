import { CECOSStatusLabels, CECOSStatusColors } from '../utils/constants';
import Badge from './ui/Badge';
import Button from './ui/Button';

/**
 * Tabla de centros de costo
 * @param {Object} props
 * @param {Array} props.cecos - Lista de centros de costo
 * @param {boolean} props.loading - Estado de carga
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @param {Function} props.onPageChange - Callback para cambiar página
 * @param {number} props.currentPage - Página actual
 * @param {number} props.totalPages - Total de páginas
 */
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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <p className="text-gray-600 mt-4">Cargando centros de costo...</p>
      </div>
    );
  }

  if (cecos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No hay centros de costo disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descripción</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cecos.map((ceco) => (
            <tr key={ceco.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ceco.codigo}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{ceco.nombre}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{ceco.descripcion || '-'}</td>
              <td className="px-6 py-4 text-sm">
                <Badge variant="SOLID" color={CECOSStatusColors[ceco.estado]}>
                  {CECOSStatusLabels[ceco.estado]}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(ceco)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm('¿Deseas eliminar este centro de costo?')) {
                      onDelete(ceco.id);
                    }
                  }}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              ← Anterior
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
