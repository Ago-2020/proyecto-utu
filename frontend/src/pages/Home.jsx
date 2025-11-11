import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopCard from '@/components/ShopCard'
import banner from '@/img/caption.jpg'
import cardImage from '@/img/card.jpg'
import React, { useEffect, useState } from 'react'

export default function Home() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    fetch('http://localhost:8000/api/shops/all')
      .then((response) => response.json())
      .then((data) => {
        setShops(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching shops:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setAuthChecked(true)
      return
    }

    const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    fetch(`${BASE}/api/auth/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (res.ok && data) {
          setIsAuthenticated(true)
          setUserName(data.nombre_usuario || data.nombre || null)
        } else {
          localStorage.removeItem('token')
          setIsAuthenticated(false)
        }
      })
      .catch((err) => {
        console.error('Error checking auth:', err)
        setIsAuthenticated(false)
      })
      .finally(() => setAuthChecked(true))
  }, [])

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '64px 16px',
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Overlay configuraciones */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0000004D',
            backdropFilter: 'blur(2px)',
          }}
        ></div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            backgroundColor: '#dc2626e6',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '700px',
            margin: '0 auto',
            color: '#FFFFFF',
          }}
        >
          {isAuthenticated ? (
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                {userName
                  ? `Bienvenido a SaborUY, ${userName}!`
                  : 'Bienvenido a SaborUY!'}
              </h1>
              <p style={{ marginBottom: '24px' }}>
                Encuentra y administra tus locales desde tu panel.
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                <Link to="/profile">
                  <button
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#dc2626',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Ir a mi perfil
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                Haz que tu negocio llegue a más personas sin complicaciones
              </h1>
              <p style={{ marginBottom: '24px' }}>
                Crea tu perfil gratis y empieza a darte a conocer en tu
                comunidad. ¡Es rápido, sencillo y totalmente online!
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                <button
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#dc2626',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Conocer más
                </button>
                <Link to="/register">
                  <button
                    style={{
                      backgroundColor: '#b91c1c',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Regístrate
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Seccion de tiendas */}
      <section
        style={{
          padding: '64px 16px',
          backgroundColor: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            backgroundColor: '#A8343433',
            color: '#A83434',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '16px',
          }}
        >
          Locales
        </span>

        <h2
          style={{
            fontSize: '32px',
            color: '#000000',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          Negocios cercanos
        </h2>
        <p style={{ color: '#000000', marginBottom: '48px' }}>
          Descubre los comercios que están a tu alrededor y aprovecha sus
          ofertas.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          {/* Card de negocio */}
          {shops.map((shop) => (
            <ShopCard
              key={shop.id_local}
              id={shop.id_local}
              title={shop.nombre_local}
              description={shop.descripcion}
              estrellas={shop.estrellas}
              etiquetas={shop.etiquetas}
              banner={shop.banner}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
