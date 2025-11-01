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
import Profile from '@/layouts/Profile'
import PerfilUsuario from '@/pages/PerfilUsuario'
import Local from '@/pages/Local'
import NotFound from '@/pages/NotFound'
import Discover from '@/pages/Discover'

import FavoriteShops from '@/pages/FavoriteShops'
import DeleteAcc from '@/pages/DeleteAcc'
import MyShops from '@/pages/MyShops'
import NewShop from '@/pages/NewShop'
import ShopComments from '@/pages/ShopComments'
import Reports from '@/pages/Reports'

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
          <Route path="/local/:id" element={<Local />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />}>
            <Route path="/profile" element={<PerfilUsuario />} />
            <Route path="/profile/favorites" element={<FavoriteShops />} />
            <Route path="/profile/delete" element={<DeleteAcc />} />
            <Route path="/profile/myshops" element={<MyShops />} />
            <Route path="/profile/newshop" element={<NewShop />} />
            <Route path="/profile/comments" element={<ShopComments />} />
            <Route path="/profile/reports" element={<Reports />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
