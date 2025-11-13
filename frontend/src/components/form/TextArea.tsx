import React from 'react';
import './TextInput.css';

interface TextAreaProps
{
    label: string;
    name: string;
    placeholder?: string;
    error?: string;
    register: any;
    required?: boolean;
    rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
    label,
    name,
    placeholder,
    error,
    register,
    required = false,
    rows = 4,
}) =>
{
    return (
        <div className="form-field">
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="required-mark" aria-label="required">*</span>}
            </label>
            <textarea
                id={name}
                rows={rows}
                className={`form-textarea ${error ? 'input-error' : ''}`}
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

export default TextArea;
