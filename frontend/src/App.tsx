import { Toaster } from 'react-hot-toast';
import { Layout } from './shared/components/Layout/Layout';
import { Dashboard } from './modules/candidates/pages/Dashboard';
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
      <Layout>
        <Dashboard />
      </Layout>
    </>
  );
}

export default App;
