import { useMemo, useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CECOSStatusLabels, CECOSStatusColors } from '../utils/constants';
import Badge from './ui/Badge';

const PROJECT_COLORS = [
  '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#ef4444', '#06b6d4', '#6366f1', '#84cc16',
];

const getProjectColor = (id) => PROJECT_COLORS[id % PROJECT_COLORS.length];

const BASE_ROOT_GROUPS = [
  { codigo: '0101', nombre: 'MQ' },
  { codigo: '0102', nombre: 'MODIFICACIONES' },
  { codigo: '0103', nombre: 'KAM' },
  { codigo: '0104', nombre: 'GABINETE' },
  { codigo: '0105', nombre: 'OTROS CLIENTES' },
  { codigo: '0106', nombre: 'RED INTERNA' },
  { codigo: '0107', nombre: 'SOLGAS' },
  { codigo: '0108', nombre: 'PROYECTOS SUR' },
  { codigo: '0109', nombre: 'CEYA' },
];

export default function CecosTable({ cecos, loading, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(() => new Set());

  const grouped = useMemo(() => {
    const basePrefixes = BASE_ROOT_GROUPS.map((group) => group.codigo);
    const customParents = (cecos || [])
      .filter((item) => {
        const code = item.codigo || '';
        const isBaseGroup = basePrefixes.some((prefix) => code.startsWith(prefix));
        const isRootParent = !item.parent_id && !item.tipo_subcuenta;
        return !isBaseGroup && isRootParent;
      })
      .sort((a, b) => (a.codigo || '').localeCompare(b.codigo || ''))
      .map((item) => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        isCustomParent: true,
      }));

    const allGroups = [...BASE_ROOT_GROUPS, ...customParents];

    return allGroups.map((group) => {
      const rows = (cecos || [])
        .filter((item) => {
          const code = item.codigo || '';
          // Excluir el código padre de sus propios hijos (tanto para base como custom)
          return code.startsWith(group.codigo) && code !== group.codigo;
        })
        .sort((a, b) => (a.codigo || '').localeCompare(b.codigo || ''));

      return {
        ...group,
        rows,
        total: rows.length,
        activos: rows.filter((row) => !!row.estado).length,
        inactivos: rows.filter((row) => !row.estado).length,
      };
    });
  }, [cecos]);

  const toggleGroup = (codigo) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(codigo)) next.delete(codigo);
      else next.add(codigo);
      return next;
    });
  };

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

  return (
    <div className="rounded border border-gray-300 bg-white shadow-sm">
      <div className="divide-y divide-gray-200">
        {grouped.map((group) => {
          const isOpen = expanded.has(group.codigo);
          return (
            <div key={group.codigo}>
              <button
                type="button"
                onClick={() => toggleGroup(group.codigo)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
              >
                {isOpen ? (
                  <ChevronDownIcon className="size-4 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="size-4 text-gray-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{group.codigo} – {group.nombre}</p>
                  <p className="text-xs text-gray-500">{group.total} jerarquías</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {group.isCustomParent && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('¿Eliminar este CECO?')) {
                          onDelete?.(group.id);
                        }
                      }}
                      className="inline-flex items-center justify-center rounded border border-red-200 p-1 text-red-700 hover:bg-red-50"
                      title="Eliminar CECO"
                      aria-label="Eliminar CECO"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  )}
                  <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">Jerarquía {group.total}</span>
                  <span className="text-xs rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">Activos {group.activos}</span>
                  <span className="text-xs rounded-full bg-red-100 px-2 py-0.5 text-red-700">Inactivos {group.inactivos}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50/50">
                  {group.rows.length === 0 ? (
                    <p className="px-10 py-3 text-sm text-gray-500">Sin elementos en esta categoría.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="px-10 py-2 text-left text-xs font-semibold text-gray-500">Código</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Nombre</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Estado</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.rows.map((ceco) => {
                            const projectColor = ceco.project_id ? getProjectColor(ceco.project_id) : null;
                            const bgStyle = projectColor 
                              ? { backgroundColor: `${projectColor}15` } 
                              : {};
                            
                            return (
                            <tr key={ceco.id} className="border-b border-gray-100 last:border-b-0" style={bgStyle}>
                              <td className="px-10 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">{ceco.codigo}</td>
                              <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{ceco.nombre}</td>
                              <td className="px-4 py-2 text-sm whitespace-nowrap">
                                <Badge color={CECOSStatusColors[ceco.estado]}>
                                  {CECOSStatusLabels[ceco.estado]}
                                </Badge>
                              </td>
                              <td className="px-4 py-2 text-sm whitespace-nowrap">
                                {ceco.nivel === 1 && !ceco.tipo_subcuenta ? (
                                  <div className="inline-flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => onEdit?.(ceco)}
                                      className="rounded border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm('¿Eliminar esta cabeza y sus subcuentas?')) {
                                          onDelete?.(ceco.id);
                                        }
                                      }}
                                      className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">—</span>
                                )}
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
