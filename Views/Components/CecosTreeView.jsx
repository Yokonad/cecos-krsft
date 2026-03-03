import { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Badge from './ui/Badge';

/**
 * Nodo individual del árbol de CECOs (Solo Lectura)
 */
function TreeNode({ ceco, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = ceco.children && ceco.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) setIsExpanded(!isExpanded);
  };

  const getNodeIcon = () => {
    if (ceco.tipo_subcuenta) {
      // Es una subcuenta (MO, GD, GI)
      return (
        <span className="inline-flex items-center justify-center size-6 rounded bg-gray-100 text-gray-600 text-xs font-medium">
          {ceco.tipo_subcuenta}
        </span>
      );
    }
    if (ceco.nivel === 1) {
      // Es un cliente/proyecto padre
      return (
        <span className="inline-flex items-center justify-center size-6 rounded bg-teal-100 text-teal-600">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </span>
      );
    }
    return null;
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded transition-colors ${
          hasChildren ? 'hover:bg-gray-50 cursor-pointer' : ''
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        {/* Botón expandir/colapsar */}
        <button
          onClick={handleToggle}
          className={`shrink-0 ${hasChildren ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {isExpanded ? (
            <ChevronDownIcon className="size-4 text-gray-500" />
          ) : (
            <ChevronRightIcon className="size-4 text-gray-500" />
          )}
        </button>

        {/* Icono del nodo */}
        <div className="shrink-0">{getNodeIcon()}</div>

        {/* Código */}
        <span className="font-mono text-xs text-gray-600 font-medium min-w-[80px]">
          {ceco.codigo}
        </span>

        {/* Nombre */}
        <span className="flex-1 text-sm text-gray-900">
          {ceco.nombre}
        </span>

        {/* Badge de estado */}
        <Badge 
          text={ceco.estado ? 'Activo' : 'Inactivo'} 
          color={ceco.estado ? 'emerald' : 'gray'}
        />
      </div>

      {/* Hijos (recursivo) */}
      {hasChildren && isExpanded && (
        <div>
          {ceco.children.map((child) => (
            <TreeNode
              key={child.id}
              ceco={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Componente principal TreeView (Solo Lectura)
 */
export default function CecosTreeView({ tree, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="size-8 animate-spin text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!tree || tree.length === 0) {
    return (
      <div className="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto size-12 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Sin centros de costo</h3>
        <p className="mt-2 text-sm text-gray-500">
          No hay centros de costo disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {tree.map((rootNode) => (
          <TreeNode
            key={rootNode.id}
            ceco={rootNode}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}
