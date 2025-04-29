import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from '../Pages/LaddingPage/LaddingPage'
import Home from '../Pages/Home/Home'
import CadastroUsuario from '../Pages/Cadastro/Cadastro'
import Login from '../Pages/Login/Login'
import Perfil from '../Pages/Perfil'
import Descobrir from '../Pages/Descobrir/Descobrir'
import Espaço from '../Pages/Espaço/Espaço'
<<<<<<< HEAD
import Perfil_Locatario from '../Pages/Perfil_Locatario/Perfil_Locatario'
=======
import DashboardLocatario from '../Pages/Locatario/DashboardLocatario'
import CadastrarEspaco from '../Pages/CadastrarEspaco.jsx/CadastrarEspaco'

>>>>>>> 56d46bd812a1f22a931fa60575122931ff2e79e2
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
<<<<<<< HEAD
        <Route path="/Perfil_Locatario" element={<Perfil_Locatario />} />
=======
        <Route path="/DashboardLocatario" element={<DashboardLocatario />} />
        <Route path="/CadastrarEspaco" element={<CadastrarEspaco />} />
>>>>>>> 56d46bd812a1f22a931fa60575122931ff2e79e2
      </Routes>
    </Router>
  )
}

export default AppRoutes