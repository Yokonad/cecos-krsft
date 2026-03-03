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
 * Grupos de CECO disponibles
 */
export const GRUPOS_CECO = {
  '0101': { codigo: '0101', nombre: 'MQ', descripcion: 'Grupo MQ' },
  '0102': { codigo: '0102', nombre: 'MODIFICACIONES', descripcion: 'Grupo Modificaciones' },
  '0103': { codigo: '0103', nombre: 'KAM', descripcion: 'Grupo KAM' },
  '0104': { codigo: '0104', nombre: 'GABINETE', descripcion: 'Grupo Gabinete' },
  '0105': { codigo: '0105', nombre: 'Otros Clientes', descripcion: 'Clientes Externos' },
  '0106': { codigo: '0106', nombre: 'Red Interna', descripcion: 'Red interna' },
  '0107': { codigo: '0107', nombre: 'Solgas', descripcion: 'Grupo Solgas' },
  '0108': { codigo: '0108', nombre: 'Proyectos Sur', descripcion: 'Grupo Proyectos Sur' },
  '0109': { codigo: '0109', nombre: 'Ceya', descripcion: 'Grupo Ceya' },
};

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
    razon_social: '',
    descripcion: '',
    estado: true,
  };
}

