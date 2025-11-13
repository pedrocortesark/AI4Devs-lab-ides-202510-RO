import React from 'react';
import './AddCandidatePage.css';

const AddCandidatePage: React.FC = () =>
{
    return (
        <div className="add-candidate-page">
            <div className="page-container">
                <h1 className="page-title">Añadir Candidato</h1>
                <p className="page-description">
                    Complete el formulario para agregar un nuevo candidato al sistema
                </p>
                {/* CandidateForm will be added in Phase 4 */}
                <div className="form-placeholder">
                    <p>Formulario de candidato</p>
                </div>
            </div>
        </div>
    );
};

export default AddCandidatePage;
