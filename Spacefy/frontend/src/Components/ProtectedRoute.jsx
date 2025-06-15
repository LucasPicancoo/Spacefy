import { Navigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useUser();

  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-[#1BAAE9] to-[#093C6B] flex items-center justify-center"
        role="status"
        aria-label="Carregando página"
      >
        <div 
          className="text-white text-xl"
          role="alert"
          aria-live="polite"
        >
          Carregando...
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 