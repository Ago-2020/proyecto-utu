import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthProvider'

export default function Report() {
  const { id } = useParams() // ID del local a reportar
  const navigate = useNavigate()
  const { token } = useAuth()

  const [razon, setRazon] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!razon.trim())
      return alert('Por favor, escribe una razón para el reporte.')
    if (!token) return alert('Debes iniciar sesión para reportar un local.')

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/api/shops/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ razon }),
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        console.error('Respuesta no JSON:', text)
        throw new Error('Respuesta inválida del servidor')
      }

      if (res.ok) {
        alert('Reporte enviado correctamente')
        navigate(`/local/${id}`)
      } else {
        alert(data.error || 'Error al enviar el reporte')
      }
    } catch (err) {
      console.error('Error al reportar:', err)
      alert('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          Reportar Local #{id}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Motivo del reporte
            </label>
            <textarea
              name="razon"
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              rows="5"
              placeholder="Describe el motivo del reporte..."
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-xl font-semibold shadow-md transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar reporte'}
          </button>
        </form>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full text-center text-gray-600 hover:text-gray-800 underline"
        >
          Volver atrás
        </button>
      </div>
    </div>
  )
}
