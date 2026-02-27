import { useState } from 'react';
import { useCecosData } from './hooks/useCecosData';
import CecosTable from './Components/CecosTable';
import CecoModal from './Components/CecoModal';
import SearchBar from './Components/SearchBar';

/**
 * Componente principal del módulo de CECOs
 * Orchestrator pattern: desestructura auth, invoca hook, renderiza componentes
 * @param {Object} props - Props de Inertia
 * @param {Object} props.auth - Datos de autenticación
 */
export default function Index({ auth }) {
  const { cecos, loading, error, currentPage, totalPages, search, createCeco, updateCeco, deleteCeco, handleSearch, handlePageChange } = useCecosData(auth);

  const [showModal, setShowModal] = useState(false);
  const [editingCeco, setEditingCeco] = useState(null);

  const handleOpenModal = (ceco = null) => {
    setEditingCeco(ceco);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingCeco(null);
    setShowModal(false);
  };

  const handleSubmit = async (data) => {
    let result;
    if (editingCeco) {
      result = await updateCeco(editingCeco.id, data);
    } else {
      result = await createCeco(data);
    }

    if (result.success) {
      handleCloseModal();
    }

    return result;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Centros de Costo</h1>
              <p className="text-gray-600 mt-2">Gestiona los centros de costo de tu organización</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              + Nuevo Centro
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <SearchBar value={search} onChange={handleSearch} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <CecosTable cecos={cecos} loading={loading} onEdit={handleOpenModal} onDelete={deleteCeco} onPageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
      </div>

      {/* Modal */}
      {showModal && <CecoModal isOpen={showModal} onClose={handleCloseModal} onSubmit={handleSubmit} initialData={editingCeco} />}
    </div>
  );
}
