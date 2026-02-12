import React from 'react';

/**
 * THE REFLECTIVE BUTTON
 * An elite UI component that features a physical "floor" reflection using -webkit-box-reflect.
 * Designed for high-ticket interfaces and sovereign command centers.
 */
export const ReflectiveButton = ({
    children,
    onClick,
    variant = 'base', // 'primary' or 'base'
    className = '',
    info,
    disabled = false,
    type = 'button',
    fullWidth = false,
    size = 'md'
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                btn-reflect-base 
                ${variant === 'primary' ? 'btn-reflect-primary' : ''} 
                ${size === 'sm' ? 'btn-reflect-sm' : ''}
                ${fullWidth ? 'w-full' : ''} 
                ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''} 
                ${className}
            `}
            data-oracle-info={info}
        >
            <span className="btn-content">
                {children}
            </span>
        </button>
    );
};
