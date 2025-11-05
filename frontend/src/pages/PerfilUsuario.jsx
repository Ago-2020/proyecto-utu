import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PerfilUsuario() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('http://localhost:8000/api/users/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()
        console.log('Respuesta del backend:', data)

        if (res.ok) {
          setUser(data.data)
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ml-[250px]">
      <main className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Cuenta de{' '}
          <span className="text-red-600">
            {user?.tipo_usuario || 'Usuario'}
          </span>
        </h1>

        {/* Info de usuario */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={user?.foto}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-red-600 mb-4 object-cover"
          />
          <h2 className="text-xl font-medium">
            {user?.nombre_usuario || 'Invitado'}
          </h2>
          <p className="text-gray-600">{user?.email_usuario || 'Sin Email'}</p>
        </div>

        {/* Botón crear local */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => navigate('/profile/newshop')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            Crear Local
          </button>
        </div>

        {/* Formulario de cambio de contraseña */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-center">
            Cambiar Contraseña
          </h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Contraseña Antigua',
              'Contraseña Nueva',
              'Confirmar Contraseña Antigua',
              'Confirmar Contraseña Nueva',
            ].map((label, i) => (
              <div key={i} className="flex flex-col">
                <label className="text-sm mb-2 font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type="password"
                  placeholder={`${
                    label.includes('Nueva')
                      ? 'Introduce la nueva'
                      : 'Introduce la'
                  } contraseña`}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800"
                />
              </div>
            ))}
          </form>

          <div className="flex justify-center mt-8">
            <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-lg font-medium shadow-md transition-all transform hover:scale-105">
              Guardar Cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
