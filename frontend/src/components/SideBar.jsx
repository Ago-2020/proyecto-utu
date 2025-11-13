import { Link, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import {
  User,
  Heart,
  Store,
  PlusCircle,
  Trash2,
  Flag,
  Star,
  Menu,
  X,
} from 'lucide-react'

export default function SideBar() {
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const res = await fetch('http://localhost:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        if (res.ok) setUser(data.data)
      } catch (error) {
        console.error('Error al obtener usuario:', error)
      }
    }
    fetchUser()
  }, [])

  const menuItems = [
    {
      title: 'Perfil de Usuario',
      items: [
        { to: '/profile', label: 'Información general', icon: <User size={18} /> },
        { to: '/profile/delete', label: 'Borrar cuenta', icon: <Trash2 size={18} /> },
      ],
    },
    {
      title: 'Favoritos',
      items: [
        { to: '/profile/favorites', label: 'Mis locales favoritos', icon: <Heart size={18} /> },
      ],
    },
    (user?.tipo_usuario === 'Emprendedor' || user?.tipo_usuario === 'Administrador') && {
      title: 'Administración',
      items: [
        { to: '/profile/myshops', label: 'Mis locales', icon: <Store size={18} /> },
        { to: '/profile/newshop', label: 'Registrar local', icon: <PlusCircle size={18} /> },
        { to: '/profile/myshopreviews', label: 'Reseñas a tiendas', icon: <Star size={18} /> },
      ],
    },
    user?.tipo_usuario === 'Administrador' && {
      title: 'Moderación y Reportes',
      items: [
        { to: '/profile/reportedreviews', label: 'Reseñas reportadas', icon: <Flag size={18} /> },
        { to: '/profile/reportedshops', label: 'Locales reportados', icon: <Store size={18} /> },
      ],
    },
  ].filter(Boolean)

  return (
    <>
      {/* === BOTÓN MÓVIL === */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 z-50 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition md:hidden"
        style={{ top: 'calc(var(--navbar-height, 130px) + 20px)' }}
      >
        <Menu size={24} />
      </button>

      {/* === SIDEBAR DE ESCRITORIO === */}
      <aside
        className="hidden md:flex flex-col bg-red-600 text-white w-64 min-h-[calc(100vh-80px)] sticky top-[80px] shadow-lg"
        style={{ zIndex: 5 }}
      >
        <div className="p-5 border-b border-red-500">
          <h2 className="text-xl font-bold text-center">Panel de Usuario</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuItems.map((section, i) => (
            <div key={i}>
              <span className="block text-xs uppercase tracking-wider opacity-80 mb-2">
                {section.title}
              </span>
              <div className="flex flex-col gap-2">
                {section.items.map((item, j) => {
                  const active = location.pathname === item.to
                  return (
                    <Link
                      key={j}
                      to={item.to}
                      className={`flex items-center gap-2 py-2 px-3 rounded-lg transition ${
                        active
                          ? 'bg-red-700 font-semibold'
                          : 'hover:bg-red-700 opacity-90'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {user && (
          <div className="p-4 text-sm text-center opacity-80 border-t border-red-500">
            Conectado como <span className="font-semibold">{user.nombre}</span>
          </div>
        )}
      </aside>

      {/* === PANEL MÓVIL EMERGENTE === */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-red-600 text-white w-80 rounded-2xl shadow-xl p-6 relative animate-fadeIn">
              {/* Botón cerrar */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-700 transition"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">Panel</h2>

              {/* Opciones centradas */}
              <div className="space-y-6 text-center overflow-y-auto max-h-[60vh]">
                {menuItems.map((section, i) => (
                  <div key={i}>
                    <span className="block text-xs uppercase tracking-wider opacity-80 mb-2">
                      {section.title}
                    </span>
                    <div className="flex flex-col gap-2">
                      {section.items.map((item, j) => {
                        const active = location.pathname === item.to
                        return (
                          <Link
                            key={j}
                            to={item.to}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                              active
                                ? 'bg-red-700 font-semibold'
                                : 'hover:bg-red-700 opacity-90'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {user && (
                <div className="mt-6 text-sm text-center opacity-80 border-t border-red-500 pt-3">
                  Conectado como{' '}
                  <span className="font-semibold">{user.nombre}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
