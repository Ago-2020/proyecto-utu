import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DefaultAvatar from '@/img/profile.png'

export default function PerfilUsuario() {
  const [user, setUser] = useState(null)
  const [passwordAntigua, setPasswordAntigua] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Cargar los datos del usuario desde el backend
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

  // Manejar el submit del formulario de cambio de contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault() // Evitar que el formulario se recargue al hacer submit

    if (!passwordAntigua || !passwordNueva) {
      setError('Ambas contraseñas son requeridas.')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setError('No estás autenticado.')
      return
    }

    try {
      const res = await fetch('http://localhost:8000/api/users/passchange', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password_antigua: passwordAntigua,
          password_nueva: passwordNueva,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setError('')
        alert('Contraseña cambiada con éxito.')
        setPasswordAntigua('')
        setPasswordNueva('')
      } else {
        setError(data.message || 'Error al cambiar la contraseña.')
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error)
      setError('Hubo un error al intentar cambiar la contraseña.')
    }
  }

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
            src={user?.foto || DefaultAvatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-red-600 mb-4 object-cover"
          />
          <h2 className="text-xl font-medium">
            {user?.nombre_usuario || 'Invitado'}
          </h2>
          <p className="text-gray-600">{user?.email_usuario || 'Sin Email'}</p>
        </div>

        {/* Botones para crear local o borrar cuenta */}
        <div className="flex justify-center mb-12 gap-6">
          <button
            onClick={() => navigate('/profile/newshop')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            Crear Local
          </button>
          <button
            onClick={() => navigate('/profile/delete')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            Borrar cuenta
          </button>
        </div>

        {/* Formulario de cambio de contraseña */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-center">
            Cambiar Contraseña
          </h3>

          {/* Mostrar errores */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form
            className="grid grid-cols-1 gap-6"
            onSubmit={handleChangePassword}
          >
            {[
              {
                label: 'Contraseña Antigua',
                value: passwordAntigua,
                setValue: setPasswordAntigua,
              },
              {
                label: 'Contraseña Nueva',
                value: passwordNueva,
                setValue: setPasswordNueva,
              },
            ].map((field, i) => (
              <div key={i} className="flex flex-col">
                <label className="text-sm mb-2 font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type="password"
                  placeholder={`Introduce la ${field.label.toLowerCase()}`}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800"
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </div>
            ))}

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
