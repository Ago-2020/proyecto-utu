import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaUser } from 'react-icons/fa'
import logo from '../img/logo.png'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('http://localhost:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setUser({
            ...data.data,
            imagen_perfil: data.data.foto || null,
          })
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error)
      }
    }
    fetchUser()
  }, [])

  return (
    <>
      {menuOpen && (
        <div className="menu-blur" onClick={() => setMenuOpen(false)} />
      )}

      <nav className="navbar">
        {/* Izquierda: Logo + botón */}
        <div className="navbar-left">
          <Link to="/" className="logo-container">
            <img src={logo} alt="SaborUY" className="logo" />
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Centro: barra de búsqueda */}
        <div className="navbar-center">
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              placeholder="Buscar locales o productos..."
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </form>
        </div>

        {/* Derecha: usuario o login */}
        <div className="navbar-right">
          {user ? (
            <>
              <Link to="/profile" className="user-info">
                <div className="flex flex-row items-center">
                  {user.imagen_perfil ? (
                    <img
                      src={user.imagen_perfil}
                      alt="perfil"
                      className="profile-pic"
                    />
                  ) : (
                    <FaUser className="default-icon" />
                  )}
                  <span className="username">{user.nombre_usuario}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <button className="btn white">Iniciar sesión</button>
              </Link>
              <Link to="/register">
                <button className="btn outline">Regístrate</button>
              </Link>
            </div>
          )}
        </div>

        {/* Menú móvil */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            Sobre Nosotros
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contacto
          </Link>

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Mi Perfil
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setMenuOpen(false)
                }}
                className="logout-btn mt-2 w-4/5 mx-auto"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="auth-buttons flex flex-col gap-2 mt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="btn white w-4/5 mx-auto">
                  Iniciar sesión
                </button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="btn outline w-4/5 mx-auto">
                  Regístrate
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <style>{`
        /* ==== BASE ==== */
        .navbar {
          position: sticky;
          top: 0;
          width: 100%;
          background-color: #ff3131;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 25px;
          z-index: 1001;
          border-bottom: 3px solid #e10000;
          transition: all 0.3s ease;
        }

        .menu-blur {
          position: fixed;
          inset: 0;
          backdrop-filter: blur(6px);
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 25px;
          margin-right: 25px;
        }

        .logo {
          width: 55px;
          height: 55px;
          transition: transform 0.2s ease;
        }

        .logo:hover {
          transform: rotate(-5deg) scale(1.05);
        }

        .menu-toggle {
          background: none;
          border: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          display: none;
        }

        .navbar-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .search-form {
          width: 100%;
          max-width: 450px;
        }

        .search-input {
          width: 100%;
          padding: 10px 18px;
          border-radius: 9999px;
          border: none;
          background-color: #fff;
          color: #333;
          font-size: 0.95rem;
          outline: none;
          transition: box-shadow 0.2s ease;
        }

        .search-input:focus {
          box-shadow: 0 0 0 2px #ffd6d6;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .profile-pic, .default-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #fff;
          color: #ff3131;
          padding: 4px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .profile-pic:hover, .default-icon:hover {
          transform: scale(1.1);
        }

        .username {
          font-weight: 500;
          margin-left: 6px;
        }

        .logout-btn {
          background-color: white;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          padding: 7px 14px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background-color: #ffe5e5;
        }

        .btn {
          padding: 7px 14px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
        }

        .btn.white {
          background-color: #fff;
          color: #dc2626;
        }

        .btn.outline {
          background: none;
          border: 2px solid #fff;
          color: #fff;
        }

        .btn.outline:hover {
          background-color: #fff;
          color: #dc2626;
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          background-color: #ff3131;
          position: absolute;
          top: 70px;
          left: 0;
          width: 100%;
          border-top: 2px solid #e10000;
          text-align: center;
          padding: 15px 0;
          transform: translateY(-20px);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 1002;
        }

        .mobile-menu.open {
          display: flex;
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-menu a {
          color: white;
          text-decoration: none;
          padding: 10px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .mobile-menu a:hover {
          background-color: #e10000;
        }

        @media (max-width: 900px) {
          .menu-toggle {
            display: block;
          }

          .navbar-center {
            order: 3;
            width: 100%;
            margin-top: 10px;
          }

          .navbar-right {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
