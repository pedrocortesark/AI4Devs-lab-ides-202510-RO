import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AddCandidatePage from './pages/AddCandidatePage';
import './App.css';

function App()
{
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidates/add" element={<AddCandidatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
