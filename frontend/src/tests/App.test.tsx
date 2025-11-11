import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('should render Layout with LTI logo', () => {
    render(<App />);
    const logo = screen.getByRole('heading', { name: /LTI/i, level: 1 });
    expect(logo).toBeInTheDocument();
  });

  it('should render Dashboard content', () => {
    render(<App />);
    // Dashboard should render with either Spanish or English welcome text
    const welcomeText = screen.getByText(/Bienvenido|Welcome/i);
    expect(welcomeText).toBeInTheDocument();
  });
});
