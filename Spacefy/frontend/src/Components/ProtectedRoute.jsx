import { Navigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1BAAE9] to-[#093C6B] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 