import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from '../Pages/LaddingPage/LaddingPage'
import Home from '../Pages/Home/Home'
import CadastroUsuario from '../Pages/Cadastro/Cadastro'
import Login from '../Pages/Login/Login'
import Perfil from '../Pages/Perfil_Usuario/Perfil'
import Descobrir from '../Pages/Descobrir/Descobrir'
import Espaço from '../Pages/Espaço/Espaço'
import Dashboard from '../Pages/DashboardLocatario/Dashboard'
import CadastrarEspaco from '../Pages/CadastrarEspaco.jsx/CadastrarEspaco'
import EditarPerfilUsuario from '../Pages/Perfil_Usuario/EditarPerfilUsuario'
import NotFound from '../Pages/NotFound/NotFound'
import Messages from '../Pages/Messages/Messages'
import Reservas from '../Pages/Reservas/Reservas'
import ProtectedRoute from '../Components/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/Descobrir" element={<ProtectedRoute><Descobrir /></ProtectedRoute>} />
        <Route path="/espaco/:id" element={<ProtectedRoute><Espaço /></ProtectedRoute>} />
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/CadastrarEspaco" element={<ProtectedRoute><CadastrarEspaco /></ProtectedRoute>} />
        <Route path="/EditarPerfilUsuario" element={<ProtectedRoute><EditarPerfilUsuario /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/reservas" element={<ProtectedRoute><Reservas /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes