import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaUser } from 'react-icons/fa'
import logo from '../img/logo.png'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('http://localhost:8000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        if (res.ok) setUser(data)
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
        padding: '12px 20px',
        backgroundColor: '#FF3131',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        flexWrap: 'wrap',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/">
          <img src={logo} alt="SaborUY" style={{ width: 36, height: 36 }} />
        </Link>

        {/* Botón menú (solo visible en móvil) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.8rem',
            color: '#fff',
            display: 'none',
          }}
          className="menu-toggle"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú de enlaces */}
      <ul
        style={{
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          listStyle: 'none',
          width: '100%',
          marginTop: '12px',
          transition: 'all 0.3s ease',
        }}
        className="menu"
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
          <Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>
            Contacto
          </Link>
        </li>
      </ul>

      {/* Buscador */}
      <div
        style={{
          flexGrow: 1,
          maxWidth: '400px',
          margin: '8px auto',
          width: '100%',
        }}
        className="search-box"
      >
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          width: '100%',
          justifyContent: 'center',
        }}
        className="user-actions"
      >
        {user ? (
          // Si hay usuario logueado
          <>
            <span>{user.nombre_usuario}</span>
            <Link to="/profile">
              {user.imagen_perfil ? (
                <img
                  src={user.imagen_perfil}
                  alt="profile"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  className="profile-hover"
                />
              ) : (
                <FaUser
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    color: '#dc2626',
                    padding: '4px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  className="profile-hover"
                />
              )}
            </Link>
            <button
              onClick={handleLogout}
              style={{
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '260px',
            }}
            className="auth-buttons"
          >
            <Link to="/login">
              <button
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#fff',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: '500',
                  width: '120px',
                }}
              >
                Iniciar sesión
              </button>
            </Link>
            <Link to="/register">
              <button
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#fff',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: '500',
                  width: '120px',
                }}
              >
                Regístrate
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Estilos Responsivos */}
      <style>
        {`
          .profile-hover:hover {
            transform: scale(1.1);
          }

          @media (min-width: 768px) {
            .menu {
              display: flex !important;
              flex-direction: row !important;
              width: auto !important;
              margin: 0 !important;
              gap: 24px !important;
            }
            .menu-toggle {
              display: none !important;
            }
            .search-box {
              order: 0;
            }
            .user-actions {
              justify-content: flex-end !important;
              width: auto !important;
            }
            .auth-buttons {
              justify-content: flex-end !important;
              gap: 8px;
            }
          }

          @media (max-width: 767px) {
            .menu-toggle {
              display: block !important;
            }
            .menu {
              animation: fadeIn 0.3s ease-in-out;
            }
            .search-box {
              order: 3;
              width: 100%;
            }
            .auth-buttons {
              flex-direction: row;
              justify-content: space-between;
              width: 100%;
              margin-top: 8px;
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </nav>
  )
}
