import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () =>
{
    const location = useLocation();

    return (
        <nav className="navigation">
            <div className="navigation-container">
                <h1 className="navigation-logo">LTI ATS</h1>

                <ul className="navigation-links">
                    <li>
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/candidates/add"
                            className={`nav-link ${location.pathname === '/candidates/add' ? 'active' : ''}`}
                        >
                            Añadir Candidato
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
