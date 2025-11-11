import React, { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="container">
          <h1 className="layout-logo">LTI</h1>
          <nav className="layout-nav">
            <a href="/">Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="layout-main">
        <div className="container">{children}</div>
      </main>

      <footer className="layout-footer">
        <div className="container">
          <p>&copy; 2025 LTI Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
