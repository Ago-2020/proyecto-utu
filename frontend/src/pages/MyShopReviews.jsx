import React, { useEffect, useState } from 'react'
import ReviewCard from '@/components/ReviewCard'

export default function MyShopReviews({ currentUserId }) {
  const [locales, setLocales] = useState([])

  const handleLike = (reviewId, liked) => {
    console.log('Toggle like review:', reviewId, liked)
  }

  const handleDelete = (reviewId) => {
    console.log('Delete review:', reviewId)
  }

  useEffect(() => {
    const token = localStorage.getItem('token') // o donde guardes tu JWT
    fetch('http://localhost:8000/api/shops/myreviews', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('No autorizado')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setLocales(data)
        } else {
          console.warn('La respuesta del servidor no es un array', data)
          setLocales([])
        }
      })
      .catch((err) => {
        console.error(err)
        setLocales([])
      })
  }, [])

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4"> Reseñas de tus locales</h2>
      {locales.map((local) => (
        <div key={local.id_local}>
          <h2 className="text-xl font-bold mb-4">{local.nombre_local}</h2>
          <div className="space-y-4">
            {local.resenas.map((review) => (
              <ReviewCard
                key={review.id_resena}
                review={review}
                currentUserId={currentUserId}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
