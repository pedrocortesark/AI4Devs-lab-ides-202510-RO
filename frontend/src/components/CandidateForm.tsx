import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextInput from './form/TextInput';
import TextArea from './form/TextArea';
import FileUpload from './form/FileUpload';
import EducationFields from './form/EducationFields';
import WorkExperienceFields from './form/WorkExperienceFields';
import './CandidateForm.css';

// Validation schemas
const educationSchema = z.object({
    institution: z.string().min(1, 'La institución es requerida').max(255),
    degree: z.string().min(1, 'El título es requerido').max(255),
    fieldOfStudy: z.string().max(255).optional().or(z.literal('')),
    startDate: z.string().min(1, 'La fecha de inicio es requerida'),
    endDate: z.string().optional().or(z.literal('')),
    current: z.boolean().default(false),
});

const workExperienceSchema = z.object({
    company: z.string().min(1, 'La empresa es requerida').max(255),
    position: z.string().min(1, 'El puesto es requerido').max(255),
    description: z.string().optional().or(z.literal('')),
    startDate: z.string().min(1, 'La fecha de inicio es requerida'),
    endDate: z.string().optional().or(z.literal('')),
    current: z.boolean().default(false),
});

const candidateSchema = z.object({
    firstName: z.string().min(1, 'El nombre es requerido').max(100),
    lastName: z.string().min(1, 'El apellido es requerido').max(100),
    email: z.string().email('Email inválido').max(255),
    phone: z.string().max(50).optional().or(z.literal('')),
    address: z.string().max(500).optional().or(z.literal('')),
    educations: z.array(educationSchema).optional(),
    workExperiences: z.array(workExperienceSchema).optional(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface CandidateFormProps
{
    onSubmit: (data: CandidateFormData, cvFile: File | null) => Promise<void>;
    isLoading?: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit, isLoading = false }) =>
{
    const [cvFile, setCvFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CandidateFormData>({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            educations: [],
            workExperiences: [],
        },
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: 'educations',
    });

    const { fields: workExperienceFields, append: appendWorkExperience, remove: removeWorkExperience } = useFieldArray({
        control,
        name: 'workExperiences',
    });

    const handleFormSubmit = async (data: CandidateFormData) =>
    {
        await onSubmit(data, cvFile);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="candidate-form">
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

                <FileUpload
                    onFileSelect={setCvFile}
                    accept=".pdf,.doc,.docx"
                    maxSizeMB={10}
                />
            </div>

            <EducationFields
                fields={educationFields}
                register={register}
                errors={errors}
                append={appendEducation}
                remove={removeEducation}
            />

            <WorkExperienceFields
                fields={workExperienceFields}
                register={register}
                errors={errors}
                append={appendWorkExperience}
                remove={removeWorkExperience}
            />

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
