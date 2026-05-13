import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={1.5} />}
      {children}
    </button>
  );
}
