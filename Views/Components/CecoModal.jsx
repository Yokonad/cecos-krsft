import { useState, useEffect } from 'react';
import { validateCecoData, createEmptyCeco } from '../utils/helpers';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

/**
 * Modal para crear/editar centros de costo
 * @param {Object} props
 * @param {boolean} props.isOpen - Mostrar modal
 * @param {Function} props.onClose - Callback para cerrar
 * @param {Function} props.onSubmit - Callback para enviar datos
 * @param {Object} props.initialData - Datos iniciales para edición
 */
export default function CecoModal({ isOpen, onClose, onSubmit, initialData }) {
  const [data, setData] = useState(createEmptyCeco());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      setData(createEmptyCeco());
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateCecoData(data);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await onSubmit(data);
    setLoading(false);

    if (!result.success) {
      setErrors({ submit: result.message });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header title={initialData ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'} />
      <Modal.Body>
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Código *"
            placeholder="CC-001"
            value={data.codigo}
            onChange={(value) => handleChange('codigo', value)}
            error={errors.codigo}
            disabled={initialData}
          />

          <Input
            label="Nombre *"
            placeholder="Centro de Costo Principal"
            value={data.nombre}
            onChange={(value) => handleChange('nombre', value)}
            error={errors.nombre}
          />

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Descripción</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Descripción del centro de costo..."
              rows="3"
              value={data.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="estado"
              checked={data.estado}
              onChange={(e) => handleChange('estado', e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="estado" className="ml-2 text-sm text-gray-700">
              Activo
            </label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading}>
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
