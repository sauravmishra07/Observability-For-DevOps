import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import AuthPage from './pages/AuthPage';
import NotesPage from './pages/NotesPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f1f1f',
            color: '#f5f0e8',
            border: '1px solid #2a2a2a',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#d4a853', secondary: '#0f0f0f' } },
        }}
      />
    </BrowserRouter>
  );
}
