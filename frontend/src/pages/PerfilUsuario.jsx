import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PerfilUsuario = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.warn('No hay token en localStorage')
        return
      }

      try {
        const res = await fetch('http://localhost:8000/api/auth/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        console.log('Status:', res.status)
        const data = await res.json()
        console.log('Respuesta del backend:', data)

        if (res.ok) {
          setUser(data)
        } else {
          console.error('Error del backend:', data.message)
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-red-600 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-center py-4 border-b border-red-500">
              Panel de Usuario
            </h2>
            <nav className="flex flex-col p-4 space-y-2">
              <span className="font-semibold text-sm mb-1 uppercase opacity-80">
                Perfil de Usuario
              </span>
              <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                Información general
              </button>
              <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                Locales favoritos
              </button>
              <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                Borrar cuenta
              </button>

              <span className="font-semibold text-sm mt-4 mb-1 uppercase opacity-80">
                Administración
              </span>
              <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                Mis locales
              </button>
              <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                Registrar local
              </button>
              <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                Comentarios
              </button>

              <span className="font-semibold text-sm mt-4 mb-1 uppercase opacity-80">
                Moderación y Reportes
              </span>
              <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                Ver reportes
              </button>
            </nav>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-8">
          <div className="bg-white shadow-md rounded-xl p-8">
            <h1 className="text-2xl font-semibold text-center mb-8">
              Cuenta de <span className="text-red-600">Emprendedor</span>
            </h1>

            {/* Info de usuario */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="https://i.pinimg.com/originals/8f/8e/11/8f8e11ecf1b0a2da7b15efc21d92a7d5.jpg"
                alt="Avatar"
                className="w-28 h-28 rounded-full border-4 border-red-600 mb-4 object-cover"
              />
              <h2 className="text-xl font-medium">
                {user?.nombre_usuario || 'Invitado'}
              </h2>
              <p className="text-gray-600">{user?.email || 'Sin Email'}</p>
            </div>

            {/* Formulario de cambio de contraseña */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">
                Cambiar Contraseña
              </h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Contraseña Antigua</label>
                  <input
                    type="password"
                    placeholder="Contraseña123"
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Contraseña Nueva</label>
                  <input
                    type="password"
                    placeholder="Contraseña123"
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">
                    Confirmar Contraseña Antigua
                  </label>
                  <input
                    type="password"
                    placeholder="Contraseña123"
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1">
                    Confirmar Contraseña Nueva
                  </label>
                  <input
                    type="password"
                    placeholder="Contraseña123"
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </form>

              <div className="flex justify-center mt-6">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PerfilUsuario
