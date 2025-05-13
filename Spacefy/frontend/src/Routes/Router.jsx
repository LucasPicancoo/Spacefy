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

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Descobrir" element={<Descobrir />} />
        <Route path="/Espaço" element={<Espaço />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CadastrarEspaco" element={<CadastrarEspaco />} />
        <Route path="/EditarPerfilUsuario" element={<EditarPerfilUsuario />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes