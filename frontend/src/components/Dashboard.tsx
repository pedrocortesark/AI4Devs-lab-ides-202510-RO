import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () =>
{
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                <h1 className="dashboard-title">Panel de Reclutador</h1>
                <p className="dashboard-subtitle">Gestiona candidatos y procesos de selección</p>

                <div className="dashboard-actions">
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/candidates/add')}
                    >
                        <span className="btn-icon">+</span>
                        Añadir Candidato
                    </button>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Total Candidatos</h3>
                        <p className="stat-number">0</p>
                    </div>
                    <div className="stat-card">
                        <h3>Candidatos Esta Semana</h3>
                        <p className="stat-number">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
