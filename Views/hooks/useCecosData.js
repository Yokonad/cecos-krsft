import { useState, useEffect, useCallback } from 'react';
import { POLLING_INTERVAL } from '../utils/constants';

/**
 * Obtiene el token CSRF del DOM
 */
const getCsrfToken = () => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.content : '';
};

/**
 * @param {Object} auth - Datos de autenticación del usuario
 * @returns {Object} Estado y funciones para gestionar CECOs
 */
export function useCecosData(auth) {
  const [cecos, setCecos] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  // ── Cargar CECOs (tabla paginada) ───
  const loadCecos = useCallback(async (page = 1, searchTerm = '', silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        search: searchTerm,
        per_page: 15,
      });

      const response = await fetch(`/api/cecoskrsft/list?${params}`);
      const result = await response.json();

      if (result.success) {
        setCecos(result.data || []);
        setCurrentPage(result.pagination.current_page);
        setTotalPages(result.pagination.last_page);
      } else {
        setError(result.message || 'Error al cargar los centros de costo');
      }
    } catch (err) {
      if (!silent) setError(err.message || 'Error de conexión');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // ── Cargar árbol jerárquico ───
  const loadTree = useCallback(async () => {
    try {
      const response = await fetch('/api/cecoskrsft/tree');
      const result = await response.json();

      if (result.success) {
        setTree(result.data || []);
      } else {
        console.error('Error al cargar árbol:', result.message);
      }
    } catch (err) {
      console.error('Error de conexión al cargar árbol:', err);
    }
  }, []);

  // ── Crear CECO simple ───
  const createCeco = useCallback(async (data) => {
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch('/api/cecoskrsft/store', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await loadCecos(currentPage, search);
        await loadTree();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Error al crear el centro de costo' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos, loadTree, currentPage, search]);

  // ── Crear cliente con subcuentas automáticas ───
  const createCecoWithSubcuentas = useCallback(async (nombre, razonSocial, descripcion, tipoCliente) => {
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch('/api/cecoskrsft/store-with-subcuentas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          nombre,
          razon_social: razonSocial || null,
          descripcion: descripcion || null,
          tipo_cliente: tipoCliente,
          estado: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Recargar ambas vistas
        await loadCecos(1, '');
        await loadTree();
        return { 
          success: true, 
          message: result.message,
          data: result.data,
        };
      } else {
        return { 
          success: false, 
          message: result.message || 'Error al crear cliente y subcuentas',
        };
      }
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'Error de conexión',
      };
    }
  }, [loadCecos, loadTree]);

  // ── Actualizar CECO ───
  const updateCeco = useCallback(async (id, data) => {
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/cecoskrsft/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await loadCecos(currentPage, search);
        await loadTree();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Error al actualizar el centro de costo' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos, loadTree, currentPage, search]);

  // ── Eliminar CECO ───
  const deleteCeco = useCallback(async (id) => {
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/cecoskrsft/${id}`, {
        method: 'DELETE',
        headers: { 
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      const result = await response.json();

      if (result.success) {
        await loadCecos(currentPage, search);
        await loadTree();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Error al eliminar el centro de costo' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' };
    }
  }, [loadCecos, loadTree, currentPage, search]);

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
    loadTree();
  }, [loadCecos, loadTree]);

  // ── Polling cada 30 segundos (silencioso) ───
  useEffect(() => {
    const interval = setInterval(() => {
      loadCecos(currentPage, search, true);
      loadTree();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [loadCecos, loadTree, currentPage, search]);

  return {
    cecos,
    tree,
    loading,
    error,
    currentPage,
    totalPages,
    search,
    createCeco,
    createCecoWithSubcuentas,
    updateCeco,
    deleteCeco,
    handleSearch,
    handlePageChange,
    loadTree,
  };
}
