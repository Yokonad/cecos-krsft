import { useState, useEffect, useCallback } from 'react';
import { POLLING_INTERVAL } from '../utils/constants';

/**
 * @param {Object} auth - Datos de autenticación del usuario
 * @returns {Object} Estado y funciones para gestionar CECOs
 */
export function useCecosData(auth) {
  const [cecos, setCecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  // ── Cargar CECOs ───
  const loadCecos = useCallback(async (page = 1, searchTerm = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        search: searchTerm,
        per_page: 15,
      });

      const response = await fetch(`/api/cecos/list?${params}`);
      const result = await response.json();

      if (result.success) {
        setCecos(result.data || []);
        setCurrentPage(result.pagination.current_page);
        setTotalPages(result.pagination.last_page);
      } else {
        setError(result.message || 'Error al cargar los centros de costo');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Crear CECO ───
  const createCeco = useCallback(async (data) => {
    try {
      const response = await fetch('/api/cecos/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await loadCecos(currentPage, search);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Error al crear el centro de costo' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos, currentPage, search]);

  // ── Actualizar CECO ───
  const updateCeco = useCallback(async (id, data) => {
    try {
      const response = await fetch(`/api/cecos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await loadCecos(currentPage, search);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Error al actualizar el centro de costo' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos, currentPage, search]);

  // ── Eliminar CECO ───
  const deleteCeco = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/cecos/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadCecos(currentPage, search);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Error al eliminar el centro de costo' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos, currentPage, search]);

  // ── Buscar CECOs ───
  const handleSearch = useCallback((term) => {
    setSearch(term);
    loadCecos(1, term);
  }, [loadCecos]);

  // ── Cambiar página ───
  const handlePageChange = useCallback((page) => {
    loadCecos(page, search);
  }, [loadCecos, search]);

  // ── Cargar data inicial ───
  useEffect(() => {
    loadCecos(1, '');
  }, [loadCecos]);

  // ── Polling cada 3 segundos ───
  useEffect(() => {
    const interval = setInterval(() => {
      loadCecos(currentPage, search);
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [loadCecos, currentPage, search]);

  return {
    cecos,
    loading,
    error,
    currentPage,
    totalPages,
    search,
    createCeco,
    updateCeco,
    deleteCeco,
    handleSearch,
    handlePageChange,
  };
}
