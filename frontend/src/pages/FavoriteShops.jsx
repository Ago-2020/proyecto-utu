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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
        Locales Favoritos
      </h1>

      {loading && <p>Cargando favoritos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && favorites.length === 0 && (
        <p>No tenés locales guardados como favoritos.</p>
      )}

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {favorites.map((shop) => (
          <ShopCard
            key={shop.id_local}
            id={shop.id_local}
            title={shop.nombre_local}
            description={shop.descripcion}
            estrellas={shop.estrellas || 0}
            etiquetas={shop.etiquetas ? shop.etiquetas.split(', ') : []}
            banner={shop.banner}
          />
        ))}
      </div>
    </div>
  )
}
