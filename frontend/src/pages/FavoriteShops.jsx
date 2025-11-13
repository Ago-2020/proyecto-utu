import React, { useEffect, useState } from 'react'
import ShopCard from '@/components/ShopCard'

export default function FavoriteShops() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Debes iniciar sesión para ver tus favoritos')
        setLoading(false)
        return
      }

      const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

      try {
        const res = await fetch(`${BASE}/api/users/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setFavorites(data.data)
        } else {
          setError('No se pudieron cargar los locales favoritos')
        }
      } catch (err) {
        console.error(err)
        setError('Error al conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const scaleFactor = 0.95

  return (
    <div className="flex flex-1 min-h-screen bg-gray-100">
      {/* Contenedor principal centrado */}
      <div className="flex flex-1 justify-center items-start pt-6 sm:pt-10 pb-6 overflow-auto">
        <main
          className="bg-white shadow-xl rounded-3xl flex flex-col items-center w-full max-w-[1200px] px-6 sm:px-10 lg:px-16"
          style={{
            paddingTop: `${4 * scaleFactor}rem`,
            paddingBottom: `${4 * scaleFactor}rem`,
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
            Locales Favoritos
          </h2>

          {loading ? (
            <p className="text-gray-500 text-center py-10">
              Cargando favoritos...
            </p>
          ) : error ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : favorites.length === 0 ? (
            <p className="text-gray-600 text-center py-10">
              No tenés locales guardados como favoritos.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center w-full">
              {favorites.map((shop) => (
                <div
                  key={shop.id_local}
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-md p-4 w-full max-w-md hover:shadow-xl transition duration-300"
                >
                  <ShopCard
                    id={shop.id_local}
                    title={shop.nombre_local}
                    description={shop.descripcion}
                    estrellas={shop.estrellas || 0}
                    etiquetas={shop.etiquetas ? shop.etiquetas.split(', ') : []}
                    banner={shop.banner}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
