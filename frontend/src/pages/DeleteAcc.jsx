import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DeleteAcc() {
  const token = localStorage.getItem('token')
  const [password_usuario, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!password_usuario) {
      setMessage('Por favor ingresa tu contraseña.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password_usuario }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Cuenta eliminada correctamente.')
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        setMessage(data.message || 'Error al eliminar la cuenta.')
      }
    } catch (error) {
      setMessage('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const scaleFactor = 0.9 // escala similar a PerfilUsuario

  return (
    <div className="flex flex-1 min-h-screen bg-gray-100">
      {/* Contenedor principal centrado */}
      <div className="flex flex-1 justify-center items-start p-6 overflow-auto pt-8">
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
            className="font-semibold text-center mb-6 text-gray-800"
            style={{ fontSize: `${24 * scaleFactor}px` }}
          >
            Eliminar <span className="text-red-600 font-bold">Cuenta</span>
          </h1>

          {/* Descripción */}
          <p
            className="text-gray-600 text-center mb-6 leading-relaxed"
            style={{ fontSize: `${15 * scaleFactor}px`, maxWidth: '90%' }}
          >
            Esta acción <span className="text-red-600 font-semibold">no se puede deshacer</span>.  
            Por favor, confirma tu contraseña antes de continuar.
          </p>

          {/* Campo de contraseña */}
          <div className="w-full max-w-md mb-6">
            <label
              className="block font-medium text-gray-700 mb-2"
              style={{ fontSize: `${14 * scaleFactor}px` }}
            >
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Introduce tu contraseña"
              value={password_usuario}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: `${10 * scaleFactor}px`,
                fontSize: `${14 * scaleFactor}px`,
              }}
              className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
            />
          </div>

          {/* Botón */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: `${10 * scaleFactor}px ${28 * scaleFactor}px`,
                fontSize: `${14 * scaleFactor}px`,
              }}
              className={`bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Eliminando...' : 'Eliminar Cuenta'}
            </button>
          </div>

          {/* Mensaje */}
          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.includes('correctamente')
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
              style={{ fontSize: `${14 * scaleFactor}px` }}
            >
              {message}
            </p>
          )}
        </main>
      </div>
    </div>
  )
}
