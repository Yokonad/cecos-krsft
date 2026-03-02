import { useMemo, useState } from 'react';
import { useCecosData } from './hooks/useCecosData';
import CecosTable from './Components/CecosTable';
import CecosTreeView from './Components/CecosTreeView';
import CecoModal from './Components/CecoModal';
import SearchBar from './Components/SearchBar';
import CecosHeader from './Components/CecosHeader';
import CecosStats from './Components/CecosStats';
import CecosTabBar from './Components/CecosTabBar';

export default function Index({ auth }) {
  const { cecos, tree, loading, error, currentPage, totalPages, search, createCeco, createCecoWithSubcuentas, updateCeco, deleteCeco, handleSearch, handlePageChange } = useCecosData(auth);

  const [showModal, setShowModal] = useState(false);
  const [editingCeco, setEditingCeco] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const flattenedTree = useMemo(() => {
    const flatten = (nodes = []) => nodes.flatMap((node) => [node, ...flatten(node.children || [])]);
    return flatten(tree || []);
  }, [tree]);

  const stats = useMemo(() => {
    const total = flattenedTree.length;
    const activos = flattenedTree.filter((node) => node.estado).length;
    const inactivos = total - activos;
    const subcuentas = flattenedTree.filter((node) => !!node.tipo_subcuenta).length;
    return { total, activos, inactivos, subcuentas };
  }, [flattenedTree]);

  const displayedCecos = useMemo(() => {
    if (activeTab === 'active') return cecos.filter((item) => !!item.estado);
    if (activeTab === 'inactive') return cecos.filter((item) => !item.estado);
    return cecos;
  }, [activeTab, cecos]);

  const isTreeTab = activeTab === 'tree';
  const tableCurrentPage = activeTab === 'all' ? currentPage : 1;
  const tableTotalPages = activeTab === 'all' ? totalPages : 1;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenModal = (ceco = null) => {
    setEditingCeco(ceco);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingCeco(null);
    setShowModal(false);
  };

  const handleSubmit = async (data, isWithSubcuentas = false) => {
    let result;
    if (editingCeco) {
      result = await updateCeco(editingCeco.id, data);
    } else if (isWithSubcuentas) {
      // Crear cliente con subcuentas automáticas
      result = await createCecoWithSubcuentas(
        data.nombre, 
        data.razon_social, 
        data.descripcion, 
        data.tipo_cliente
      );
    } else {
      // Crear cliente simple
      result = await createCeco(data);
    }

    if (result.success) {
      handleCloseModal();
      showToast(result.message || (editingCeco ? 'Centro de costo actualizado' : 'Cliente y subcuentas creados exitosamente'));
    }

    return result;
  };

  const handleDelete = async (id) => {
    const result = await deleteCeco(id);
    if (result?.success) {
      showToast(result.message || 'Centro de costo eliminado');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div role="alert" className={`rounded-md border p-4 shadow-lg ${
            toast.type === 'success' ? 'bg-green-50 border-green-500' :
            toast.type === 'error'   ? 'bg-red-50 border-red-500' :
                                       'bg-amber-50 border-amber-500'
          }`}>
            <div className="flex items-start gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                stroke="currentColor"
                className={`size-5 mt-0.5 ${toast.type === 'success' ? 'text-green-700' : toast.type === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
                {toast.type === 'success'
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                }
              </svg>
              <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : toast.type === 'error' ? 'text-red-800' : 'text-amber-800'}`}>
                {toast.message}
              </p>
              <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="w-full px-12 py-4">
        <div className="space-y-6">
          <CecosHeader onBack={handleBack} onCreate={() => handleOpenModal()} />

          <CecosStats
            total={stats.total}
            activos={stats.activos}
            inactivos={stats.inactivos}
            subcuentas={stats.subcuentas}
          />

          <CecosTabBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={{
              total: stats.total,
              activos: stats.activos,
              inactivos: stats.inactivos,
            }}
          />

          {!isTreeTab && <SearchBar value={search} onChange={handleSearch} />}

          {/* Error */}
          {error && (
            <div role="alert" className="rounded-md border border-red-500 bg-red-50 p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-red-700 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Conditional Views */}
          {!isTreeTab ? (
            <CecosTable
              cecos={displayedCecos}
              loading={loading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onPageChange={activeTab === 'all' ? handlePageChange : () => {}}
              currentPage={tableCurrentPage}
              totalPages={tableTotalPages}
            />
          ) : (
            <CecosTreeView
              tree={tree}
              loading={loading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CecoModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingCeco}
        />
      )}
    </div>
  );
}
