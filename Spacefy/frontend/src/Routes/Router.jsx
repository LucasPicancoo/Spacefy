import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from '../Pages/LaddingPage/LaddingPage'
import Home from '../Pages/Home/Home'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes