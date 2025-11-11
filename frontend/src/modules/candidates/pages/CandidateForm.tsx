import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { CreateCandidateSchema, CreateCandidateFormData } from '../types/candidateSchemas';
import { apiClient } from '../../../shared/services/apiClient';
import { useI18n } from '../../../shared/hooks/useI18n';
import './CandidateForm.css';

export const CandidateForm: React.FC = () =>
{
    const { t } = useI18n();
    const navigate = useNavigate();
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateCandidateFormData>({
        resolver: zodResolver(CreateCandidateSchema),
        defaultValues: {
            education: [],
            experience: [],
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = event.target.files?.[0];
        if (file)
        {
            // Validate PDF only
            if (file.type !== 'application/pdf')
            {
                toast.error(t('candidateForm.errors.pdfOnly'));
                return;
            }
            // Validate max 10MB
            if (file.size > 10 * 1024 * 1024)
            {
                toast.error(t('candidateForm.errors.fileTooLarge'));
                return;
            }
            setCvFile(file);
        }
    };

    const removeFile = () =>
    {
        setCvFile(null);
    };

    const onSubmit = async (data: CreateCandidateFormData) =>
    {
        try
        {
            setIsSubmitting(true);

            const formData = new FormData();

            // Add JSON data
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.addressLine1) formData.append('addressLine1', data.addressLine1);
            if (data.addressLine2) formData.append('addressLine2', data.addressLine2);
            if (data.city) formData.append('city', data.city);
            if (data.state) formData.append('state', data.state);
            if (data.postalCode) formData.append('postalCode', data.postalCode);
            if (data.country) formData.append('country', data.country);

            // Add education and experience as JSON strings (always send, even if empty)
            formData.append('education', JSON.stringify(data.education || []));
            formData.append('experience', JSON.stringify(data.experience || []));

            // Add CV file if present
            if (cvFile)
            {
                formData.append('cv', cvFile);
            }

            await apiClient.post('/candidates', formData);

            toast.success(t('candidateForm.success'));
            navigate('/');
        } catch (error: any)
        {
            console.error('Error creating candidate:', error);
            console.error('Error data:', error.data);
            console.error('Error status:', error.status);

            const errorMessage = error.data?.detail || error.message || t('candidateForm.errors.generic');
            toast.error(errorMessage);

            // Log validation errors if present
            if (error.data?.errors)
            {
                console.error('Validation errors:', error.data.errors);
            }
        } finally
        {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="candidate-form-container">
            <div className="candidate-form-header">
                <h1>{t('candidateForm.title')}</h1>
                <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
                    {t('common.cancel')}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="candidate-form">
                {/* Personal Information Section */}
                <section className="form-section">
                    <h2>{t('candidateForm.personalInfo')}</h2>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="firstName">{t('candidateForm.fields.firstName')} *</label>
                            <input
                                id="firstName"
                                type="text"
                                {...register('firstName')}
                                aria-invalid={!!errors.firstName}
                                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                            />
                            {errors.firstName && (
                                <span id="firstName-error" className="error-message" role="alert">
                                    {errors.firstName.message}
                                </span>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="lastName">{t('candidateForm.fields.lastName')} *</label>
                            <input
                                id="lastName"
                                type="text"
                                {...register('lastName')}
                                aria-invalid={!!errors.lastName}
                                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                            />
                            {errors.lastName && (
                                <span id="lastName-error" className="error-message" role="alert">
                                    {errors.lastName.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="email">{t('candidateForm.fields.email')} *</label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            {errors.email && (
                                <span id="email-error" className="error-message" role="alert">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="phone">{t('candidateForm.fields.phone')}</label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="+1234567890"
                                {...register('phone')}
                                aria-invalid={!!errors.phone}
                                aria-describedby={errors.phone ? 'phone-error' : undefined}
                            />
                            {errors.phone && (
                                <span id="phone-error" className="error-message" role="alert">
                                    {errors.phone.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="addressLine1">{t('candidateForm.fields.addressLine1')}</label>
                        <input id="addressLine1" type="text" {...register('addressLine1')} />
                    </div>

                    <div className="form-field">
                        <label htmlFor="addressLine2">{t('candidateForm.fields.addressLine2')}</label>
                        <input id="addressLine2" type="text" {...register('addressLine2')} />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="city">{t('candidateForm.fields.city')}</label>
                            <input id="city" type="text" {...register('city')} />
                        </div>

                        <div className="form-field">
                            <label htmlFor="state">{t('candidateForm.fields.state')}</label>
                            <input id="state" type="text" {...register('state')} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="postalCode">{t('candidateForm.fields.postalCode')}</label>
                            <input id="postalCode" type="text" {...register('postalCode')} />
                        </div>

                        <div className="form-field">
                            <label htmlFor="country">{t('candidateForm.fields.country')}</label>
                            <input id="country" type="text" {...register('country')} />
                        </div>
                    </div>
                </section>

                {/* CV Upload Section */}
                <section className="form-section">
                    <h2>{t('candidateForm.cv')}</h2>

                    <div className="file-upload">
                        {!cvFile ? (
                            <label htmlFor="cv-upload" className="file-upload-label">
                                <span>{t('candidateForm.uploadCV')}</span>
                                <input
                                    id="cv-upload"
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                    className="file-upload-input"
                                />
                            </label>
                        ) : (
                            <div className="file-preview">
                                <span className="file-name">{cvFile.name}</span>
                                <span className="file-size">({(cvFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="btn btn-danger btn-sm"
                                    aria-label={t('common.remove')}
                                >
                                    {t('common.remove')}
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="help-text">{t('candidateForm.cvHelp')}</p>
                </section>

                {/* Submit Button */}
                <div className="form-actions">
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">
                        {isSubmitting ? t('common.saving') : t('common.save')}
                    </button>
                </div>
            </form>
        </div>
    );
};
