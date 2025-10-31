import { useNavigate } from 'react-router-dom'
import cardImage from '@/img/card.jpg'
import { FaStar, FaRegStar, FaUser, FaHeart } from 'react-icons/fa'
import React from 'react'

export default function ShopCard({ id, title, description, estrellas }) {
  const navigate = useNavigate()

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
          maxWidth: '280px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px #0000001a',
          border: '1px solid #ddd',
          backgroundColor: '#FFFFFF',
        }}
      >
        <img
          src={cardImage}
          alt="Negocio"
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
          <div className="flex text-yellow-500 mt-1 items-center">
            {[...Array(5)].map((_, i) =>
              i < estrellas ? <FaStar key={i} /> : <FaRegStar key={i} />,
            )}
            <p className="text-gray-700 mt-2">{estrellas}</p>
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
            <span
              style={{
                backgroundColor: '#A8343433',
                color: '#A83434',
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '12px',
              }}
            >
              Restaurante
            </span>
            <span
              style={{
                backgroundColor: '#A8343433',
                color: '#A83434',
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '12px',
              }}
            >
              Comida
            </span>
            <span
              style={{
                backgroundColor: '#A8343433',
                color: '#A83434',
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '12px',
              }}
            >
              Café
            </span>
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
