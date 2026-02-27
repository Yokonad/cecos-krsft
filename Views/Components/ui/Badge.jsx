import clsx from 'clsx';

/**
 * Componente Badge para etiquetas
 * @param {Object} props
 * @param {string} props.children - Contenido del badge
 * @param {string} props.variant - SOLID, BORDER o DOT
 * @param {string} props.color - Color: success, warning, error, info, primary, secondary, etc.
 * @param {boolean} props.dismissible - Mostrar botón eliminar
 * @param {Function} props.onDismiss - Callback al eliminar
 * @param {string} props.icon - Clase de ícono
 */
export default function Badge({
  children,
  variant = 'SOLID',
  color = 'primary',
  dismissible = false,
  onDismiss,
  icon,
}) {
  const baseClasses =
    'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors';

  const variantClasses = {
    SOLID: {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      primary: 'bg-teal-100 text-teal-800',
      secondary: 'bg-gray-100 text-gray-800',
    },
    BORDER: {
      success: 'border border-green-300 text-green-700 bg-white',
      warning: 'border border-yellow-300 text-yellow-700 bg-white',
      error: 'border border-red-300 text-red-700 bg-white',
      info: 'border border-blue-300 text-blue-700 bg-white',
      primary: 'border border-teal-300 text-teal-700 bg-white',
      secondary: 'border border-gray-300 text-gray-700 bg-white',
    },
    DOT: {
      success: 'text-green-700 bg-white',
      warning: 'text-yellow-700 bg-white',
      error: 'text-red-700 bg-white',
      info: 'text-blue-700 bg-white',
      primary: 'text-teal-700 bg-white',
      secondary: 'text-gray-700 bg-white',
    },
  };

  const dotClasses = {
    success: 'w-2 h-2 rounded-full bg-green-500',
    warning: 'w-2 h-2 rounded-full bg-yellow-500',
    error: 'w-2 h-2 rounded-full bg-red-500',
    info: 'w-2 h-2 rounded-full bg-blue-500',
    primary: 'w-2 h-2 rounded-full bg-teal-500',
    secondary: 'w-2 h-2 rounded-full bg-gray-500',
  };

  return (
    <span className={clsx(baseClasses, variantClasses[variant][color])}>
      {variant === 'DOT' && <span className={dotClasses[color]} />}
      {icon && <i className={clsx(icon, 'text-sm')} />}
      {children}
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-1 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  );
}
