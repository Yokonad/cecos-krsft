import { useMemo, useState } from 'react';
import { useCecosData } from './hooks/useCecosData';
import CecosTable from './Components/CecosTable';
import CecosHeader from './Components/CecosHeader';
import CecosStats from './Components/CecosStats';
import CecosTabBar from './Components/CecosTabBar';
import CecoModal from './Components/CecoModal';

export default function Index({ auth }) {
  const { cecos, loading, error, createCeco, createCecoWithSubcuentas, updateCeco, deleteCeco } = useCecosData(auth);

  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCeco, setEditingCeco] = useState(null);

  const stats = useMemo(() => ({
    total: cecos.length,
    activos: cecos.filter(c => c.estado).length,
    inactivos: cecos.filter(c => !c.estado).length,
    subcuentas: cecos.filter(c => !!c.tipo_subcuenta).length,
  }), [cecos]);

  const tabCounts = useMemo(() => ({
    total: cecos.length,
    activos: cecos.filter(c => c.estado).length,
    inactivos: cecos.filter(c => !c.estado).length,
  }), [cecos]);

  const displayedCecos = cecos;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 1300);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleOpenCreate = () => {
    setEditingCeco(null);
    setShowModal(true);
  };

  const handleOpenEdit = (ceco) => {
    setEditingCeco(ceco);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCeco(null);
  };

  const handleSubmit = async (payload, withSubcuentas = false) => {
    let result;
    if (editingCeco) {
      result = await updateCeco(editingCeco.id, payload);
    } else if (withSubcuentas) {
      result = await createCecoWithSubcuentas(payload);
    } else {
      result = await createCeco(payload);
    }

    if (result.success) {
      showToast(result.message || (editingCeco ? 'Cabeza actualizada' : 'Cabeza creada'));
      handleCloseModal();
    }

    return result;
  };

  const handleDelete = async (cecoId) => {
    const result = await deleteCeco(cecoId);
    showToast(result.message || (result.success ? 'Cabeza eliminada' : 'No se pudo eliminar'), result.success ? 'success' : 'error');
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
          <CecosHeader onBack={handleBack} onCreate={handleOpenCreate} />

          <CecosStats
            total={stats.total}
            activos={stats.activos}
            inactivos={stats.inactivos}
            subcuentas={stats.subcuentas}
          />

          <CecosTabBar counts={tabCounts} />

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

          <CecosTable
            cecos={displayedCecos}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <CecoModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingCeco}
        cecos={cecos}
      />
    </div>
  );
}
