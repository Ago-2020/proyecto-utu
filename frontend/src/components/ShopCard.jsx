import { useNavigate } from 'react-router-dom'
import cardImage from '@/img/card.jpg'
import { FaStar, FaRegStar, FaUser, FaHeart, FaRegHeart } from 'react-icons/fa'
import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/AuthProvider'

export default function ShopCard({
  id,
  title,
  description,
  estrellas,
  onFavoriteChange,
  etiquetas,
}) {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const { token } = useAuth()

  const STORAGE_KEY = 'favorite_shops'

  const readFavorites = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  }, [])

  const writeFavorites = useCallback((arr) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
    } catch (e) {
      console.error('Error writing favorites', e)
    }
  }, [])

  useEffect(() => {
    const favs = readFavorites()
    setIsFavorite(favs.includes(Number(id) || id))
  }, [id, readFavorites])

  const toggleFavorite = () => {
    const favs = readFavorites()
    const key = Number(id) || id
    let next
    if (favs.includes(key)) {
      next = favs.filter((i) => i !== key)
      setIsFavorite(false)
    } else {
      next = [...favs, key]
      setIsFavorite(true)
    }
    writeFavorites(next)
    if (typeof onFavoriteChange === 'function') onFavoriteChange(next)
  }

  etiquetas = etiquetas || []

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '280px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px #0000001a',
          border: '1px solid #ddd',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Boton de favoritos */}
        {token && (
          <button
            aria-label={
              isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
            }
            onClick={toggleFavorite}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 10,
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isFavorite ? (
              <FaHeart style={{ color: '#ef4444' }} />
            ) : (
              <FaRegHeart style={{ color: '#ef4444' }} />
            )}
          </button>
        )}

        <img
          src={cardImage}
          alt={title || 'Negocio'}
          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
        />
        <div style={{ padding: '16px', textAlign: 'left' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#000000',
            }}
          >
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-500 mt-1 items-center">
              {[...Array(5)].map((_, i) =>
                i < estrellas ? <FaStar key={i} /> : <FaRegStar key={i} />,
              )}
            </div>
            <p className="text-gray-700">{estrellas ? estrellas : '0.0'}</p>
          </div>
          <p
            style={{
              color: '#666666',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            {description}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '16px',
            }}
          >
            {etiquetas.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#A8343433',
                  color: '#A83434',
                  padding: '4px 8px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate(`/local/${id}`)}
            style={{
              width: '100%',
              padding: '8px 0',
              backgroundColor: '#dc2626',
              color: '#FFFFFF',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  )
}
