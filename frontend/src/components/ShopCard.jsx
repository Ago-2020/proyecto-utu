import { useNavigate } from 'react-router-dom'
import cardImage from '@/img/ShopCardBanner.webp'
import { FaStar, FaRegStar, FaUser, FaHeart, FaRegHeart } from 'react-icons/fa'
import React, { useEffect, useState, useCallback } from 'react'

export default function ShopCard({
  id,
  title,
  description,
  estrellas,
  onFavoriteChange,
  etiquetas,
  banner,
}) {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const userToken = localStorage.getItem('token') // o desde tu contexto
    setToken(userToken)
    const fetchFavoriteStatus = async () => {
      if (!token) return

      try {
        const response = await fetch(
          `http://localhost:8000/api/shops/${id}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data = await response.json()
        if (data.success) setIsFavorite(data.isFavorite)
      } catch (error) {
        console.error('Error al obtener favorito:', error)
      }
    }

    fetchFavoriteStatus()
  }, [id, token]) // se ejecuta al cargar el componente

  const STORAGE_KEY = 'favorite_shops'

  const [loading, setLoading] = useState(false)

  const toggleFavorite = async () => {
    if (loading) return
    setLoading(true)

    if (!token) {
      alert('Debes iniciar sesión para usar favoritos')
      return
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST'

      const response = await fetch(
        `http://localhost:8000/api/shops/${id}/favorite`,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const text = await response.text()
      let data = {}
      if (text) {
        try {
          data = JSON.parse(text)
        } catch {
          console.error('Respuesta no válida del servidor:', text)
        }
      }

      if (response.ok) {
        setIsFavorite(!isFavorite)
        console.log(data.message)
      } else {
        alert(data.message || 'Error al actualizar favoritos')
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error)
      alert('Error al conectar con el servidor')
    }
    setLoading(false)
  }

  etiquetas = etiquetas || []

  const bannerURL = banner
    ? `http://localhost:8000/api/getimg.php?file=${banner}`
    : cardImage

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
            {loading ? (
              '...'
            ) : isFavorite ? (
              <FaHeart style={{ color: '#dc2626' }} />
            ) : (
              <FaRegHeart style={{ color: '#dc2626' }} />
            )}
          </button>
        )}

        <img
          src={bannerURL}
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
