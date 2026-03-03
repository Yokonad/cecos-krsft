import { useState, useEffect, useMemo } from 'react';
import { validateCecoData, createEmptyCeco, GRUPOS_CECO } from '../utils/helpers';

export default function CecoModal({ isOpen, onClose, onSubmit, initialData, cecos = [] }) {
  const [data, setData] = useState(createEmptyCeco());
  const [tipoCliente, setTipoCliente] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isCreatingWithSubcuentas, setIsCreatingWithSubcuentas] = useState(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setTipoCliente(null);
      setIsCreatingWithSubcuentas(false);
    } else {
      setData(createEmptyCeco());
      setTipoCliente(null);
      setIsCreatingWithSubcuentas(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Limpiar código cuando cambie el tipo de cliente
  useEffect(() => {
    if (tipoCliente === 'MANUAL') {
      setData(prev => ({ ...prev, codigo: '' }));
    }
  }, [tipoCliente]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    // Si es creación y tipo_cliente está seleccionado
    if (!initialData && tipoCliente && tipoCliente !== 'MANUAL' && isCreatingWithSubcuentas) {
      await handleSubmitWithSubcuentas();
    } else {
      await handleSubmitSimple();
    }
  };

  const handleSubmitSimple = async () => {
    const { isValid, errors: validationErrors } = validateCecoData(data);
    if (!isValid) { setErrors(validationErrors); return; }
    setLoading(true);
    const result = await onSubmit(data, false);
    setLoading(false);
    if (!result.success) setErrors({ submit: result.message });
  };

  const handleSubmitWithSubcuentas = async () => {
    if (!data.nombre?.trim()) {
      setErrors({ nombre: 'El nombre es requerido' });
      return;
    }

    const tipoClienteValue = tipoCliente?.startsWith('CUSTOM:')
      ? tipoCliente.replace('CUSTOM:', '')
      : tipoCliente;

    setLoading(true);
    const result = await onSubmit({
      nombre: data.nombre,
      tipo_cliente: tipoClienteValue,
    }, true);
    setLoading(false);
    if (!result.success) setErrors({ submit: result.message });
  };

  const isEditMode = !!initialData;
  const canCreateWithSubcuentas = !isEditMode && tipoCliente && tipoCliente !== 'MANUAL';
  const selectedCustomParentCode = tipoCliente?.startsWith('CUSTOM:')
    ? tipoCliente.replace('CUSTOM:', '')
    : null;
  const customParentCecos = useMemo(() => {
    const baseGroupCodes = Object.keys(GRUPOS_CECO);

    return (cecos || [])
      .filter((item) => {
        const code = item.codigo || '';
        const isBaseGroup = baseGroupCodes.some((prefix) => code.startsWith(prefix));
        const isRootParent = !item.parent_id && !item.tipo_subcuenta;
        return !isBaseGroup && isRootParent;
      })
      .sort((a, b) => (a.codigo || '').localeCompare(b.codigo || ''));
  }, [cecos]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cecoModalTitle"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <h2 id="cecoModalTitle" className="text-xl font-bold text-gray-900">
            {isEditMode ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="-mt-1 -me-1 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto px-6 pb-2 space-y-4">
          {/* Error general */}
          {errors.submit && (
            <div role="alert" className="rounded-md border border-red-500 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Selector de Tipo de Cliente — solo en creación */}
          {!isEditMode && (
            <fieldset className="rounded-md border border-gray-200 p-4">
              <legend className="text-sm font-medium text-gray-700 px-2">
                Seleccionar Grupo de Operaciones *
              </legend>
              <div className="space-y-2 mt-3">
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(GRUPOS_CECO).map(([codigo, grupo]) => (
                    <label 
                      key={codigo} 
                      className={`flex items-center justify-center h-11 px-3 rounded border transition-all cursor-pointer ${
                        tipoCliente === codigo 
                          ? 'border-teal-500 bg-teal-50 shadow-sm' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipoCliente"
                        value={codigo}
                        checked={tipoCliente === codigo}
                        onChange={(e) => {
                          setTipoCliente(e.target.value);
                          setIsCreatingWithSubcuentas(true);
                        }}
                        className="sr-only"
                      />
                      <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                        {codigo} - {grupo.nombre}
                      </span>
                    </label>
                  ))}
                </div>

                {customParentCecos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {customParentCecos.map((ceco) => (
                      <label
                        key={ceco.id || ceco.codigo}
                        className={`flex items-center justify-center h-11 px-3 rounded border transition-all cursor-pointer ${
                          selectedCustomParentCode === ceco.codigo
                            ? 'border-teal-500 bg-teal-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tipoCliente"
                          value={`CUSTOM:${ceco.codigo}`}
                          checked={selectedCustomParentCode === ceco.codigo}
                          onChange={(e) => {
                            setTipoCliente(e.target.value);
                            setIsCreatingWithSubcuentas(true);
                          }}
                          className="sr-only"
                        />
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap truncate">
                          {ceco.codigo} - {ceco.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                
                {/* Opción para crear CECO manual */}
                <label 
                  className={`flex items-center justify-center gap-2 h-11 px-4 rounded border-2 border-dashed transition-all cursor-pointer ${
                    tipoCliente === 'MANUAL' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipoCliente"
                    value="MANUAL"
                    checked={tipoCliente === 'MANUAL'}
                    onChange={(e) => {
                      setTipoCliente(e.target.value);
                      setIsCreatingWithSubcuentas(false);
                    }}
                    className="sr-only"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">
                    Crear CECO personalizado
                  </span>
                </label>
              </div>
            </fieldset>
          )}

          {/* Alerta de subcuentas automáticas */}
          {canCreateWithSubcuentas && (
            <div className="rounded-md bg-teal-50 px-4 py-3 border-l-4 border-teal-500">
              <p className="text-sm text-teal-800 font-medium">
                Se crearán automáticamente 3 subcuentas:
              </p>
              <ul className="mt-1 text-xs text-teal-700 space-y-0.5">
                <li>• MO (Mano de Obra)</li>
                <li>• Gastos Directos</li>
                <li>• Gastos Indirectos</li>
              </ul>
            </div>
          )}

          {/* Nombre */}
          <label htmlFor="ceco-nombre">
            <span className="text-sm font-medium text-gray-700">Nombre *</span>
            <input
              id="ceco-nombre"
              name="ceco_nombre"
              type="text"
              placeholder="Nombre del centro de costo"
              value={data.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className={`mt-0.5 w-full rounded border shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 ${errors.nombre ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'}`}
            />
            {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
          </label>

          {/* Código - Solo si es manual */}
          {!isEditMode && tipoCliente === 'MANUAL' && (
            <label htmlFor="ceco-codigo">
              <span className="text-sm font-medium text-gray-700">Código *</span>
              <input
                id="ceco-codigo"
                name="ceco_codigo"
                type="text"
                placeholder="Ej: 999999"
                value={data.codigo}
                onChange={(e) => handleChange('codigo', e.target.value.replace(/\D/g, ''))}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className={`mt-0.5 w-full rounded border shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 ${errors.codigo ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'}`}
              />
              {errors.codigo && <p className="mt-1 text-xs text-red-600">{errors.codigo}</p>}
              <p className="mt-1 text-xs text-gray-500">Ingresa un código de 6 dígitos</p>
            </label>
          )}

          {/* Estado — Solo en edición */}
          {isEditMode && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={data.estado}
                onClick={() => handleChange('estado', !data.estado)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${data.estado ? 'bg-teal-500' : 'bg-gray-200'}`}
              >
                <span
                  className={`inline-block size-5 rounded-full bg-white shadow ring-0 transition-transform ${data.estado ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {data.estado ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || (!isEditMode && !tipoCliente)}
            className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {loading && (
              <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isEditMode
              ? 'Actualizar'
              : canCreateWithSubcuentas
                ? 'Crear Cliente'
                : (tipoCliente === 'MANUAL')
                  ? 'Crear CECO'
                  : 'Crear'}
          </button>
        </footer>

      </div>
    </div>
  );
}
