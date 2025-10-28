import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '@/layouts/Dashboard'
import Login from '@/pages/Login'
import LoginDev from '@/pages/TestLogin'
import Register from '@/pages/Register'
import RegisterDev from '@/pages/TestRegister'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Terms from '@/pages/Terms'
import Profile from '@/pages/Profile'
import PerfilUsuario from '@/pages/PerfilUsuario'
import Local from '@/pages/Local'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerdev" element={<RegisterDev />} />
        <Route path="/logindev" element={<LoginDev />} />
        <Route element={<Dashboard />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile" element={<PerfilUsuario />} />
          <Route path="/local/:id" element={<Local />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
