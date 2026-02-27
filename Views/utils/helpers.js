/**
 * Formatea un CECO para visualización
 * @param {Object} ceco - Objeto del centro de costo
 * @returns {Object} CECO formateado
 */
export function formatCeco(ceco) {
  return {
    ...ceco,
    codigoFormato: ceco.codigo?.toUpperCase() || '',
  };
}

/**
 * Valida datos básicos de un CECO
 * @param {Object} data - Datos a validar
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateCecoData(data) {
  const errors = {};

  if (!data.codigo?.trim()) {
    errors.codigo = 'El código es requerido';
  }

  if (!data.nombre?.trim()) {
    errors.nombre = 'El nombre es requerido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Crea un objeto CECO vacío
 * @returns {Object}
 */
export function createEmptyCeco() {
  return {
    codigo: '',
    nombre: '',
    descripcion: '',
    estado: true,
  };
}
