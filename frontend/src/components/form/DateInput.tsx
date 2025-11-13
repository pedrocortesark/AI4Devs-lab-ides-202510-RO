import React from 'react';
import './DateInput.css';

interface DateInputProps
{
    label: string;
    name: string;
    placeholder?: string;
    error?: string;
    register: any;
    required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
    label,
    name,
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
                type="date"
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder={placeholder}
                {...register}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default DateInput;
