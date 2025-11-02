import React, { useEffect, useState } from 'react'
import ShopCard from '@/components/ShopCard'

export default function FavoriteShops() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const STORAGE_KEY = 'favorite_shops'

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    let ids = []
    try {
      ids = raw ? JSON.parse(raw) : []
    } catch (e) {
      ids = []
    }

    if (!ids || ids.length === 0) {
      setFavorites([])
      setLoading(false)
      return
    }

    const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

   // (Ez) Obtener detalles para cada ID favorito
    Promise.all(
      ids.map((id) =>
        fetch(`${BASE}/api/shops/${id}`).then((res) => {
          if (!res.ok) throw new Error('Error fetching shop ' + id)
          return res.json()
        }),
      ),
    )
      .then((shops) => setFavorites(shops))
      .catch((err) => {
        console.error(err)
        setError('No se pudieron cargar los locales favoritos')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Locales Favoritos</h1>

      {loading && <p>Cargando favoritos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && favorites.length === 0 && (
        <p>No tenés locales guardados como favoritos.</p>
      )}

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {favorites.map((shop) => (
          <ShopCard
            key={shop.id_local || shop.id || shop.idLocal}
            id={shop.id_local || shop.id || shop.idLocal}
            title={shop.nombre_local || shop.nombre || 'Local'}
            description={shop.descripcion || ''}
            estrellas={shop.estrellas || 0}
          />
        ))}
      </div>
    </div>
  )
}
