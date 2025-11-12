import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/AuthProvider'
import ProtectedRoute from '@/ProtectedRoute'

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
import NewPublication from '@/pages/NewPublication'
import EditShop from '@/pages/EditShop'

import ReportedReviews from '@/pages/ReportedReviews'
import ReportedShops from '@/pages/ReportedShops'

import CursorFollower from '@/components/CursorFollower'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerdev" element={<RegisterDev />} />
          <Route path="/logindev" element={<LoginDev />} />

          {/* Layout principal */}
          <Route element={<Dashboard />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/local/:id" element={<Local />} />
            <Route path="/search" element={<Discover />} />

            {/* Zona protegida del perfil */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            >
              <Route index element={<PerfilUsuario />} />
              <Route path="favorites" element={<FavoriteShops />} />
              <Route path="delete" element={<DeleteAcc />} />
              <Route path="myshops" element={<MyShops />} />
              <Route path="newshop" element={<NewShop />} />
              <Route path="comments" element={<ShopComments />} />
              <Route path="reportedreviews" element={<ReportedReviews />} />
              <Route path="reportedshops" element={<ReportedShops />} />
              <Route path="newpublication" element={<NewPublication />} />
              <Route path="editshop" element={<EditShop></EditShop>}></Route>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* seguidor del cursor */}
        <CursorFollower />
      </AuthProvider>
    </BrowserRouter>
  )
}
