import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './shared/components/Layout/Layout';
import { Dashboard } from './modules/candidates/pages/Dashboard';
import { CandidateForm } from './modules/candidates/pages/CandidateForm';
import './App.css';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#61dafb',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/candidates/new" element={<CandidateForm />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
