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
        const res = await fetch(
          'http://localhost:8000/api/admin/reports/reviews',
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

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
      const res = await fetch(
        `http://localhost:8000/api/admin/reports/reviews/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      const data = await res.json()

      if (res.ok) {
        alert(data.message)
        setReviews(reviews.filter((r) => r.id_resena !== id))
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
      const res = await fetch(
        `http://localhost:8000/api/admin/reports/reviews/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      const data = await res.json()

      if (res.ok) {
        alert(data.message)
        setReviews(reviews.filter((r) => r.id_resena !== id))
      } else {
        alert(data.message || 'Error al eliminar reseña')
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message)
    }
  }

  if (loading) return <p>Cargando reseñas reportadas...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full h-full max-w-6xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Reseñas Reportadas</h2>
          {reviews.length === 0 ? (
            <p>No hay reseñas reportadas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID Reseña</th>
                    <th>Usuario</th>
                    <th>Local</th>
                    <th>Comentario</th>
                    <th>Estrellas</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id_resena}>
                      <td>{r.id_resena}</td>
                      <td>{r.nombre_usuario || `Usuario #${r.id_usuario}`}</td>
                      <td>{r.nombre_local || `Local #${r.id_local}`}</td>
                      <td>{r.comentario}</td>
                      <td>{r.estrellas}</td>
                      <td className="text-center space-x-3">
                        <Link
                          to={`/local/${r.id_local}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
                        >
                          Ver Local
                        </Link>
                        <button
                          onClick={() => handleUnreport(r.id_resena)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
                        >
                          Quitar Reporte
                        </button>
                        <button
                          onClick={() => handleDelete(r.id_resena)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
                        >
                          Eliminar Reseña
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
