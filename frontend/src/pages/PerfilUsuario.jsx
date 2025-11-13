import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DefaultAvatar from '@/img/profile.png'
import SideBar from "../components/SideBar"

export default function PerfilUsuario() {
  const [user, setUser] = useState(null)
  const [passwordAntigua, setPasswordAntigua] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Factor de escala para agrandar/reducir la "caja"
  const scaleFactor = 0.9 // más grande que antes

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
        if (res.ok) setUser(data.data)
      } catch (err) {
        console.error('Error al obtener usuario:', err)
      }
    }
    fetchUser()
  }, [])

  const handleChangePassword = async (e) => {
    e.preventDefault()
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
    } catch (err) {
      console.error(err)
      setError('Hubo un error al intentar cambiar la contraseña.')
    }
  }

  return (
    <div className="flex flex-1 h-screen bg-gray-100">
      {/* Contenedor principal centrado */}
      <div className="flex flex-1 justify-center items-start p-4 overflow-auto pt-6">
        <main
          className="bg-white shadow-xl rounded-3xl flex flex-col items-center"
          style={{
            padding: `${4 * scaleFactor}rem`,
            width: `${100 * scaleFactor}%`,
            maxWidth: `${820 * scaleFactor}px`,
          }}
        >
          {/* Título */}
          <h1
            className="font-semibold text-center mb-6"
            style={{ fontSize: `${20 * scaleFactor}px` }}
          >
            Cuenta de <span className="text-red-600">{user?.tipo_usuario || 'Usuario'}</span>
          </h1>

          {/* Información de usuario */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={user?.foto || DefaultAvatar}
              alt="Avatar"
              style={{
                width: `${80 * scaleFactor}px`,
                height: `${80 * scaleFactor}px`,
                marginBottom: `${12 * scaleFactor}px`,
              }}
              className="rounded-full border-4 border-red-600 object-cover"
            />
            <h2 style={{ fontSize: `${16 * scaleFactor}px`, fontWeight: 500 }}>
              {user?.nombre_usuario || 'Invitado'}
            </h2>
            <p style={{ fontSize: `${14 * scaleFactor}px`, color: '#4B5563' }}>
              {user?.email_usuario || 'Sin Email'}
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-center mb-6 gap-4">
            <button
              onClick={() => navigate('/profile/newshop')}
              style={{
                padding: `${6 * scaleFactor}px ${24 * scaleFactor}px`,
                fontSize: `${14 * scaleFactor}px`,
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition hover:scale-105"
            >
              Crear Local
            </button>
            <button
              onClick={() => navigate('/profile/delete')}
              style={{
                padding: `${6 * scaleFactor}px ${24 * scaleFactor}px`,
                fontSize: `${14 * scaleFactor}px`,
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition hover:scale-105"
            >
              Borrar cuenta
            </button>
          </div>

          {/* Formulario de cambio de contraseña */}
          <div className="w-full max-w-md flex flex-col items-center">
            <h3
              className="font-semibold mb-3 text-center"
              style={{ fontSize: `${18 * scaleFactor}px` }}
            >
              Cambiar Contraseña
            </h3>
            {error && (
              <p className="text-red-500 text-center mb-2" style={{ fontSize: `${14 * scaleFactor}px` }}>
                {error}
              </p>
            )}
            <form className="grid grid-cols-1 gap-4 w-full" onSubmit={handleChangePassword}>
              {[
                { label: 'Contraseña Antigua', value: passwordAntigua, setValue: setPasswordAntigua },
                { label: 'Contraseña Nueva', value: passwordNueva, setValue: setPasswordNueva },
              ].map((field, i) => (
                <div key={i} className="flex flex-col w-full">
                  <label
                    className="font-medium text-gray-700 mb-1"
                    style={{ fontSize: `${14 * scaleFactor}px` }}
                  >
                    {field.label}
                  </label>
                  <input
                    type="password"
                    placeholder={`Introduce la ${field.label.toLowerCase()}`}
                    style={{
                      padding: `${8 * scaleFactor}px`,
                      fontSize: `${14 * scaleFactor}px`,
                    }}
                    className="border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
                    value={field.value}
                    onChange={(e) => field.setValue(e.target.value)}
                  />
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  style={{
                    padding: `${8 * scaleFactor}px ${24 * scaleFactor}px`,
                    fontSize: `${14 * scaleFactor}px`,
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition hover:scale-105"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
