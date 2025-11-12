import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DeleteAcc() {
  const token = localStorage.getItem('token')
  const [password_usuario, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!password_usuario) {
      setMessage('Por favor ingresa tu contraseña')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      console.log('Token:', token)

      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ password_usuario }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/login')
      } else {
        setMessage(data.message || 'Error al eliminar la cuenta')
      }
    } catch (error) {
      setMessage('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full h-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Borrar Cuenta</h2>
        <input
          type="password"
          placeholder="Contraseña"
          value={password_usuario}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          {loading ? 'Eliminando...' : 'Eliminar cuenta'}
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </main>
    </div>
  )
}
