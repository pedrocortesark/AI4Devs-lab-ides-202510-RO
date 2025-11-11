import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('should render dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Panel de Control|Dashboard/i)).toBeInTheDocument();
  });

  it('should render welcome message', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Bienvenido|Welcome/i)).toBeInTheDocument();
  });

  it('should render add candidate button', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Agregar Candidato|Add Candidate/i)).toBeInTheDocument();
  });

  it('should render language switcher', () => {
    render(<Dashboard />);
    expect(screen.getByText('ES')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('should display no candidates message', () => {
    render(<Dashboard />);
    expect(screen.getByText(/no hay candidatos|No candidates/i)).toBeInTheDocument();
  });
});
