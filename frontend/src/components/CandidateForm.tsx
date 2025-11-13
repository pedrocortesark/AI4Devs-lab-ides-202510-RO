import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextInput from './form/TextInput';
import TextArea from './form/TextArea';
import './CandidateForm.css';

// Validation schema
const candidateSchema = z.object({
    firstName: z.string().min(1, 'El nombre es requerido').max(100),
    lastName: z.string().min(1, 'El apellido es requerido').max(100),
    email: z.string().email('Email inválido').max(255),
    phone: z.string().max(50).optional().or(z.literal('')),
    address: z.string().max(500).optional().or(z.literal('')),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface CandidateFormProps
{
    onSubmit: (data: CandidateFormData) => Promise<void>;
    isLoading?: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit, isLoading = false }) =>
{
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CandidateFormData>({
        resolver: zodResolver(candidateSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="candidate-form">
            <div className="form-section">
                <h2 className="section-title">Información Personal</h2>

                <div className="form-row">
                    <TextInput
                        label="Nombre"
                        name="firstName"
                        placeholder="Juan"
                        register={register('firstName')}
                        error={errors.firstName?.message}
                        required
                    />

                    <TextInput
                        label="Apellido"
                        name="lastName"
                        placeholder="Pérez"
                        register={register('lastName')}
                        error={errors.lastName?.message}
                        required
                    />
                </div>

                <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="juan.perez@example.com"
                    register={register('email')}
                    error={errors.email?.message}
                    required
                />

                <TextInput
                    label="Teléfono"
                    name="phone"
                    type="tel"
                    placeholder="+34 612 345 678"
                    register={register('phone')}
                    error={errors.phone?.message}
                />

                <TextArea
                    label="Dirección"
                    name="address"
                    placeholder="Calle Mayor 1, 28013 Madrid"
                    register={register('address')}
                    error={errors.address?.message}
                    rows={3}
                />
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn-primary btn-lg"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Guardando...
                        </>
                    ) : (
                        'Guardar Candidato'
                    )}
                </button>
            </div>
        </form>
    );
};

export default CandidateForm;
