import { useState, useEffect, useCallback } from 'react';
import { POLLING_INTERVAL } from '../utils/constants';

const getCsrfToken = () => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.content : '';
};

/**
 * @param {Object} auth - Datos de autenticación del usuario
 * @returns {Object} Estado para mostrar jerarquía de CECOs (solo lectura)
 */
export function useCecosData(auth) {
  const [cecos, setCecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Cargar CECOs (lista plana) ───
  const loadCecos = useCallback(async () => {
    try {
      const response = await fetch('/api/cecoskrsft/list?per_page=500');
      const result = await response.json();

      if (result.success) {
        setCecos(result.data || []);
        setError(null);
      } else {
        setError(result.message || 'Error al cargar los centros de costo');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCecoWithSubcuentas = useCallback(async (payload) => {
    try {
      const response = await fetch('/api/cecoskrsft/store-with-subcuentas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        await loadCecos();
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Error al crear CECO' };
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos]);

  const createCeco = useCallback(async (payload) => {
    try {
      const response = await fetch('/api/cecoskrsft/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        await loadCecos();
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Error al crear CECO' };
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos]);

  const updateCeco = useCallback(async (id, payload) => {
    try {
      const response = await fetch(`/api/cecoskrsft/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        await loadCecos();
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Error al actualizar CECO' };
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos]);

  const deleteCeco = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/cecoskrsft/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });
      const result = await response.json();
      if (result.success) {
        await loadCecos();
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Error al eliminar CECO' };
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos]);

  // ── Cargar data inicial ───
  useEffect(() => {
    loadCecos();
  }, [loadCecos]);

  // ── Polling cada 30 segundos (silencioso) ───
  useEffect(() => {
    const interval = setInterval(() => {
      loadCecos();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [loadCecos]);

  return {
    cecos,
    loading,
    error,
      createCeco,
    createCecoWithSubcuentas,
    updateCeco,
    deleteCeco,
  };
}
