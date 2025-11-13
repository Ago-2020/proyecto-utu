import React, { useEffect, useState } from 'react'
import { useAuth } from '@/AuthProvider'
import ReviewCard from '@/components/ReviewCard'

export default function MyShopReviews({ currentUserId }) {
  const { token } = useAuth()
  const [locales, setLocales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const scaleFactor = 0.95

  const handleLike = (reviewId, liked) => {
    console.log('Toggle like review:', reviewId, liked)
  }

  const handleDelete = (reviewId) => {
    console.log('Delete review:', reviewId)
  }

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    fetch('http://localhost:8000/api/shops/myreviews', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error('Error al cargar las reseñas: No autorizado o error interno.')
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
  }, [token])

  return (
    <div className="flex flex-1 min-h-screen bg-gray-100">
      <div className="flex flex-1 justify-center items-start p-4 overflow-auto pt-6">
        <main
          className="bg-white shadow-xl rounded-3xl flex flex-col items-center w-full max-w-[1000px] px-4 sm:px-6 lg:px-10"
          style={{
            paddingTop: `${4 * scaleFactor}rem`,
            paddingBottom: `${4 * scaleFactor}rem`,
          }}
        >
          <h1
            className="font-semibold text-center mb-8 text-gray-800 text-xl sm:text-2xl"
          >
            Reseñas de <span className="text-red-600">tus locales</span>
          </h1>

          {loading ? (
            <p className="text-gray-500 text-center py-8">Cargando reseñas...</p>
          ) : error ? (
            <p className="text-red-600 text-center py-8">{error}</p>
          ) : locales.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No tenés locales con reseñas aún.
            </p>
          ) : (
            <div className="w-full space-y-10">
              {locales.map((local) => (
                <div
                  key={local.id_local}
                  className="border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50"
                >
                  <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4  pb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="break-words">{local.nombre_local}</span>
                    <span className="text-gray-500 font-normal text-base sm:text-lg whitespace-nowrap">
                      ({local.resenas.length}{' '}
                      {local.resenas.length === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  </h3>

                  {local.resenas.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {local.resenas.map((review) => (
                        <div
                          key={review.id_resena}
                          className="col-span-1 w-full"
                        >
                          <div className="w-full h-full">
                            <ReviewCard
                              review={review}
                              currentUserId={currentUserId}
                              onLike={handleLike}
                              onDelete={handleDelete}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic mt-2">
                      Este local no tiene reseñas.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
