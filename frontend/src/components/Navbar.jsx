import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo.png'
{
  /* Logo */
}
import profile from '../img/profile.png'
{
  /* Logo de perfil */
}

export default function Navbar() {
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    // Elimina el usuario del estado
    setUser(null)

    // Elimina el token o los datos del usuario almacenados
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // Redirige al inicio o login (si usas react-router)
    navigate('/login')
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.warn('No hay token en localStorage')
        return
      }

      try {
        const res = await fetch('http://localhost:8000/api/auth/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        console.log('Status:', res.status)
        const data = await res.json()
        console.log('Respuesta del backend:', data)

        if (res.ok) {
          setUser(data)
        } else {
          console.error('Error del backend:', data.message)
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error)
      }
    }

    fetchUser()
  }, [])

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        backgroundColor: '#FF3131',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo y los Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/">
          <img
            src={logo}
            alt="SaborUY"
            style={{ width: '32px', height: '32px' }}
          />
        </Link>
        <ul
          style={{
            display: 'flex',
            gap: '24px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>
              Sobre Nosotros
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              style={{ color: '#fff', textDecoration: 'none' }}
            >
              Contacto
            </Link>
          </li>
        </ul>
      </div>

      {/* Buscador */}
      <div style={{ flexGrow: 1, maxWidth: '400px', margin: '0 24px' }}>
        <input
          type="text"
          placeholder="Buscar..."
          style={{
            width: '100%',
            padding: '8px 16px',
            borderRadius: '9999px',
            border: '1px solid #a3a3a3ff',
            backgroundColor: '#ffffffe6',
            color: '#000000ff',
          }}
        />
      </div>

      {/* Perfil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          // Si hay usuario logueado
          <>
            <span>{user.nombre_usuario}</span>
            <Link to="/profile">
              <img
                src={profile}
                alt="profile"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  marginLeft: '8px',
                }}
              />
            </Link>

            <button
              onClick={handleLogout}
              style={{
                marginLeft: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#fff',
                color: '#dc2626',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          // Si NO hay usuario logueado
          <>
            <Link to="/register">
              <button
                style={{
                  marginLeft: '8px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#fff',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Regístrate
              </button>
            </Link>

            <Link to="/login">
              <button
                style={{
                  marginLeft: '8px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#fff',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Iniciar sesión
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
