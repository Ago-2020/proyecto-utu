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
    <div>
      <h2>Reseñas Reportadas</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
  )
}

export default ReportedReviews
