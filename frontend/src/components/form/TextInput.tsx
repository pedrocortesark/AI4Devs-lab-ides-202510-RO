import React from 'react';
import './TextInput.css';

interface TextInputProps
{
    label: string;
    name: string;
    type?: 'text' | 'email' | 'tel';
    placeholder?: string;
    error?: string;
    register: any;
    required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    name,
    type = 'text',
    placeholder,
    error,
    register,
    required = false,
}) =>
{
    return (
        <div className="form-field">
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="required-mark" aria-label="required">*</span>}
            </label>
            <input
                id={name}
                type={type}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder={placeholder}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                {...register}
            />
            {error && (
                <span id={`${name}-error`} className="error-message" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};

export default TextInput;
