import { useNavigate } from 'react-router-dom'
import cardImage from '@/img/ShopCardBanner.webp'
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'

const getColor = (tag) => {
  switch(tag) {
    case 'Panaderia': return '#F59E0B'
    case 'Confiteria': return '#F87171'
    case 'Heladería': return '#60A5FA'
    case 'Cafetería': return '#A78BFA'
    case 'Rotisería': return '#34D399'
    case 'Hamburguesería': return '#FBBF24'
    case 'Restaurante': return '#EF4444'
    case 'Pastelería': return '#3B82F6'
    default: return '#A83434'
  }
}

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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userToken = localStorage.getItem('token')
    setToken(userToken)

    const fetchFavoriteStatus = async () => {
      if (!userToken) return
      try {
        const response = await fetch(
          `http://localhost:8000/api/shops/${id}/favorite`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        const data = await response.json()
        if (data.success) setIsFavorite(data.isFavorite)
      } catch (error) {
        console.error('Error al obtener favorito:', error)
      }
    }

    fetchFavoriteStatus()
  }, [id])

  const toggleFavorite = async () => {
    if (loading) return
    setLoading(true)

    if (!token) {
      alert('Debes iniciar sesión para usar favoritos')
      setLoading(false)
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
        }
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
      if (response.ok) setIsFavorite(!isFavorite)
      else alert(data.message || 'Error al actualizar favoritos')
    } catch (error) {
      console.error('Error al conectar con el servidor:', error)
      alert('Error al conectar con el servidor')
    }
    setLoading(false)
  }

  // Banner
  const bannerURL = banner
    ? typeof banner === 'string'
      ? `http://localhost:8000/api/getimg.php?file=${banner}`
      : URL.createObjectURL(banner)
    : cardImage

  // Etiquetas: convierte strings o usa objetos {label,value,color}
  const etiquetasArray = etiquetas?.map(tag => {
    if (typeof tag === 'string') {
      return { label: tag, value: tag, color: getColor(tag) }
    }
    return tag
  }) || []

  return (
    <div className="shop-card-wrapper">
      <div className="shop-card">
        {token && (
          <button
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            onClick={toggleFavorite}
            className="favorite-btn"
          >
            {loading ? '...' : isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}

        <img src={bannerURL} alt={title || 'Negocio'} className="shop-banner" />

        <div className="shop-content">
          <h3 className="shop-title">{title}</h3>

          <div className="stars-container">
            {[...Array(5)].map((_, i) =>
              i < estrellas ? <FaStar key={i} /> : <FaRegStar key={i} />
            )}
            <p className="rating">{estrellas ? estrellas : '0.0'}</p>
          </div>

          <p className="shop-description">{description}</p>

          <div className="tags-container">
            {etiquetasArray.map((tag, i) => (
              <span
                key={i}
                className="tag"
                style={{
                  backgroundColor: tag.color + '33', // fondo con transparencia
                  color: tag.color
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate(`/local/${id}`)}
            className="ver-mas-btn"
          >
            Ver más
          </button>
        </div>
      </div>

      <style>{`
        .shop-card-wrapper {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .shop-card {
          position: relative;
          max-width: 280px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px #0000001a;
          border: 1px solid #ddd;
          background-color: #fff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .shop-card:hover {
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .favorite-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 9999px;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
        }

        .shop-banner {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .shop-content {
          padding: 16px;
          text-align: left;
        }

        .shop-title {
          font-size: 18px;
          font-weight: bold;
          color: #000;
        }

        .stars-container {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          color: #facc15;
        }

        .rating {
          color: #555;
          font-size: 14px;
          margin-left: 6px;
        }

        .shop-description {
          color: #666;
          font-size: 14px;
          margin: 8px 0 12px 0;
        }

        .tags-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .tag {
          padding: 4px 8px;
          border-radius: 9999px;
          font-size: 12px;
        }

        .ver-mas-btn {
          width: 100%;
          padding: 8px 0;
          background-color: #dc2626;
          color: #fff;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .ver-mas-btn:hover {
          background-color: #b91c1c;
        }
      `}</style>
    </div>
  )
}
