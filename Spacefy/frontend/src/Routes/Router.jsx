import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from '../Pages/LaddingPage/LaddingPage'
import Home from '../Pages/Home/Home'
import CadastroUsuario from '../Pages/Cadastro/Cadastro'
import Login from '../Pages/Login/Login'
import Perfil from '../Pages/Perfil_Usuario/Perfil'
import Descobrir from '../Pages/Descobrir/Descobrir'
import Espaço from '../Pages/Espaço/Espaço'
import DashboardLocatario from '../Pages/Locatario/DashboardLocatario'
import CadastrarEspaco from '../Pages/CadastrarEspaco.jsx/CadastrarEspaco'
import Perfil_Locatario from '../Pages/Perfil_Locatario/Perfil_Locatario'
import EditarPerfilUsuario from '../Pages/Perfil_Usuario/EditarPerfilUsuario'

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
        <Route path="/DashboardLocatario" element={<DashboardLocatario />} />
        <Route path="/CadastrarEspaco" element={<CadastrarEspaco />} />
        <Route path="/Perfil_Locatario" element={<Perfil_Locatario />} />
        <Route path="/EditarPerfilUsuario" element={<EditarPerfilUsuario />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes