import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateForm from '../components/CandidateForm';
import candidateService from '../services/candidateService';
import './AddCandidatePage.css';

const AddCandidatePage: React.FC = () =>
{
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (data: any) =>
    {
        try
        {
            setIsLoading(true);
            setError(null);

            await candidateService.createCandidate(data);

            setSuccess(true);

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() =>
            {
                navigate('/');
            }, 1500);
        }
        catch (err: any)
        {
            setError(err.message || 'Error al crear el candidato');
            setIsLoading(false);
        }
    };

    return (
        <div className="add-candidate-page">
            <div className="page-container">
                <h1 className="page-title">Añadir Candidato</h1>
                <p className="page-description">
                    Complete el formulario para agregar un nuevo candidato al sistema
                </p>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✓</span>
                        Candidato creado exitosamente. Redirigiendo...
                    </div>
                )}

                {!success && (
                    <CandidateForm onSubmit={handleSubmit} isLoading={isLoading} />
                )}
            </div>
        </div>
    );
};

export default AddCandidatePage;
