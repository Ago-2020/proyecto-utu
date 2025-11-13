import React, { useEffect, useState } from 'react'
import ReviewCard from '@/components/ReviewCard'

export default function MyShopReviews({ currentUserId }) {
  const [locales, setLocales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleLike = (reviewId, liked) => {
    // Lógica para manejar el like/dislike de una reseña
    console.log('Toggle like review:', reviewId, liked)
  }

  const handleDelete = (reviewId) => {
    // Lógica para manejar la eliminación de una reseña
    console.log('Delete review:', reviewId)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setLoading(true)
    setError(null)

    fetch('http://localhost:8000/api/shops/myreviews', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar las reseñas: No autorizado o error interno.')
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
        setError('No se pudieron cargar las reseñas de tus locales.')
        setLocales([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    // Contenedor principal: padding y ancho máximo
    <div className="flex justify-center p-4 sm:p-6 lg:p-8 min-h-[500px] bg-gray-50">
      <div className="w-full max-w-7xl space-y-8">
        
        {/* Título principal */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b pb-2 text-center sm:text-left">
          ⭐ Reseñas de tus locales
        </h2>

        {/* --- Manejo de estados de carga y error --- */}
        {loading && (
          <p className="text-center text-lg text-gray-600 py-10">
            Cargando reseñas...
          </p>
        )}
        
        {error && (
          <p className="text-center text-lg text-red-600 py-10">
            Error: {error}
          </p>
        )}

        {!loading && !error && locales.length === 0 && (
          <p className="text-gray-500 text-lg text-center py-10">
            No tienes locales registrados con reseñas, o aún no han recibido ninguna.
          </p>
        )}
        
        {/* Contenido principal: Iteración sobre locales */}
        {!loading && locales.map((local) => (
          <div 
            key={local.id_local} 
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100"
            // 💡 Estilo para evitar desbordamiento de palabras largas en el contenedor
            style={{ wordBreak: 'break-word' }} 
          >
            {/* Título del local */}
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
              Local: **{local.nombre_local}** ({local.resenas.length} {local.resenas.length === 1 ? 'reseña' : 'reseñas'})
            </h3>

            {/* Grid responsivo para las ReviewCards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {local.resenas.map((review) => (
                <div key={review.id_resena} className="col-span-1">
                  <ReviewCard
                    review={review}
                    currentUserId={currentUserId}
                    onLike={handleLike}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
            
            {/* Mensaje si no hay reseñas para este local */}
            {local.resenas.length === 0 && (
                <p className="text-gray-500 italic mt-4">Este local no tiene reseñas.</p>
            )}

          </div>
        ))}

      </div>
    </div>
  )
}