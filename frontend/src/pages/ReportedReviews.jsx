import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function ReportedReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReportedReviews = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:8000/api/admin/reports/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setReviews(data.data)
        else throw new Error(data.message || 'Error al obtener reseñas')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReportedReviews()
  }, [])

  const handleUnreport = async (id) => {
    if (!window.confirm('¿Quitar estado de reportado de esta reseña?')) return
    try {
      const res = await fetch(`http://localhost:8000/api/admin/reports/reviews/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        setReviews((prev) => prev.filter((r) => r.id_resena !== id))
      } else {
        alert(data.message || 'Error al quitar el reporte')
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta reseña definitivamente?')) return
    try {
      const res = await fetch(`http://localhost:8000/api/admin/reports/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        setReviews((prev) => prev.filter((r) => r.id_resena !== id))
      } else {
        alert(data.message || 'Error al eliminar reseña')
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message)
    }
  }

  if (loading) return <p className="p-6 text-gray-700">Cargando reseñas reportadas...</p>
  if (error) return <p className="text-red-500 p-6">Error: {error}</p>

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <main className="bg-white shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto">
        {/* Título rojo sin borde */}
        <h2 className="text-2xl font-bold mb-6 text-red-600">
          Reseñas Reportadas
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No hay reseñas reportadas.</p>
        ) : (
          <>
            {/* Tabla para pantallas grandes */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">ID</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">Local</th>
                    <th className="p-3">Comentario</th>
                    <th className="p-3">Estrellas</th>
                    <th className="p-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id_resena} className="hover:bg-gray-50">
                      <td className="p-3">{r.id_resena}</td>
                      <td className="p-3">
                        {r.nombre_usuario || `Usuario #${r.id_usuario}`}
                      </td>
                      <td className="p-3">
                        {r.nombre_local || `Local #${r.id_local}`}
                      </td>
                      <td className="p-3">{r.comentario}</td>
                      <td className="p-3">{r.estrellas}</td>
                      <td className="p-3 text-center space-x-2">
                        <Link
                          to={`/local/${r.id_local}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Ver
                        </Link>
                        <button
                          onClick={() => handleUnreport(r.id_resena)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Quitar
                        </button>
                        <button
                          onClick={() => handleDelete(r.id_resena)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista tipo "card" para móviles */}
            <div className="md:hidden flex flex-col gap-4">
              {reviews.map((r) => (
                <div
                  key={r.id_resena}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Usuario:</span>{' '}
                    {r.nombre_usuario || `#${r.id_usuario}`}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Local:</span>{' '}
                    {r.nombre_local || `#${r.id_local}`}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Comentario:</span>{' '}
                    {r.comentario}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">⭐ {r.estrellas}</p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/local/${r.id_local}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg text-center"
                    >
                      Ver Local
                    </Link>
                    <button
                      onClick={() => handleUnreport(r.id_resena)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg"
                    >
                      Quitar Reporte
                    </button>
                    <button
                      onClick={() => handleDelete(r.id_resena)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
