import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, Flag, MessageSquareWarning } from 'lucide-react'

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/admin/reports', label: 'Reportes de locales', icon: <Flag size={18} /> },
    { path: '/admin/reports/reviews', label: 'Reseñas reportadas', icon: <MessageSquareWarning size={18} /> },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md flex justify-between items-center px-4 py-3 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
        <button
          className="lg:hidden p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menú"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`bg-white shadow-lg w-64 p-4 flex flex-col gap-4 fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:h-auto lg:shadow-none`}
        >
          <nav className="flex flex-col gap-2">
            {navItems.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-lg transition
                ${location.pathname === path
                  ? 'bg-gray-200 font-medium text-gray-900'
                  : 'hover:bg-gray-100 text-gray-700'}`}
              >
                {icon} {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Fondo oscuro cuando el sidebar está abierto en móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 p-6 lg:ml-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
