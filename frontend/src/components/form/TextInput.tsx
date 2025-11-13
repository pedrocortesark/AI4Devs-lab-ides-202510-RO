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
                {required && <span className="required-mark">*</span>}
            </label>
            <input
                id={name}
                type={type}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder={placeholder}
                {...register}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default TextInput;
