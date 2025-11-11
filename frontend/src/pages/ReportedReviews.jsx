import React, { useEffect, useState } from 'react'

const ReportedReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReportedReviews = async () => {
      try {
        const token = localStorage.getItem('token') // JWT si aplica
        const response = await fetch(
          'http://localhost:8000/api/admin/reports/reviews',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data = await response.json()

        if (data.success) {
          setReviews(data.data)
        } else {
          setError('No se pudieron cargar las reseñas reportadas.')
        }
      } catch (err) {
        setError('Error al conectarse con el servidor.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReportedReviews()
  }, [])

  if (loading) return <p>Cargando reseñas reportadas...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full h-full max-w-6xl">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Reseñas Reportadas</h2>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID Reseña</th>
                <th>Usuario</th>
                <th>Local</th>
                <th>Comentario</th>
                <th>Estrellas</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id_resena}>
                  <td>{review.id_resena}</td>
                  <td>{review.id_usuario}</td>
                  <td>{review.id_local}</td>
                  <td>{review.comentario}</td>
                  <td>{review.estrellas}</td>
                  <td>{new Date(review.fecha_creacion).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default ReportedReviews
