import React from 'react';

type ButtonVariant = 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray';

interface ButtonProps {
  onClick: () => void;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<ButtonVariant, string> = {
  blue: 'bg-blue-500 hover:bg-blue-600',
  green: 'bg-green-500 hover:bg-green-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
  red: 'bg-red-500 hover:bg-red-600',
  gray: 'bg-gray-500 hover:bg-gray-600',
};

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  variant = 'blue', 
  children,
  className = '',
  disabled = false,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
