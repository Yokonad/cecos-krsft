import clsx from 'clsx';
import { forwardRef } from 'react';

/**
 * Componente Button reutilizable
 * @param {Object} props
 * @param {string} props.children - Contenido del botón
 * @param {string} props.variant - primary, secondary, danger, ghost, success, warning
 * @param {string} props.size - sm, md, lg
 * @param {boolean} props.loading - Mostrar estado de carga
 * @param {boolean} props.disabled - Deshabilitar botón
 * @param {Function} props.onClick - Callback al hacer clic
 * @param {string} props.className - Clases CSS adicionales
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
      primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 disabled:bg-teal-400',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 disabled:text-gray-400',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-400',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={loading || disabled}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          loading && 'opacity-75 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading && <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-r-transparent rounded-full" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
