import { Link } from 'react-router-dom'
import leftImage from '../img/izquierda.png'
import logo from '../img/logo.png'
import React, { useState } from 'react'

export default function Login() {
  const [email_usuario, setEmail] = useState('')
  const [password_usuario, setPassword] = useState('')
  const [response, setResponse] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_usuario,
          password_usuario,
        }),
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error('Error:', error)
      setResponse({ success: false, message: 'Error en la conexión' })
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Mitad izquierda con imagen */}
      <div
        className="w-1/2"
        style={{
          backgroundImage: `url(${leftImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Mitad derecha con logo y formulario */}
      <div
        className="w-1/2 flex items-center justify-center relative"
        style={{ backgroundColor: '#FF3131' }}
      >
        {/* Logo que lleva a Home */}
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            style={{
              position: 'absolute',
              top: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '120px',
              cursor: 'pointer',
            }}
          />
        </Link>

        {/* Contenedor del formulario */}
        <div
          className="p-8 rounded-lg shadow-lg border"
          style={{
            backgroundColor: '#FFFFFF',
            width: '600px',
            padding: '75px',
            marginTop: '95px',
          }}
        >
          <h2
            className="text-4xl font-bold mb-8 text-center"
            style={{ color: '#000000' }}
          >
            Iniciar Sesión
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: '#5D5D5D' }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: '#5D5D5D', color: '#5D5D5D' }}
                required
                value={email_usuario}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: '#5D5D5D' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Escribe tu contraseña"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: '#5D5D5D', color: '#5D5D5D' }}
                required
                value={password_usuario}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Botón principal */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-bold mt-4"
              style={{ background: 'linear-gradient(90deg, #FF3131, #C31313)' }}
            >
              Iniciar Sesión
            </button>

            {/* Link a registro */}
            <div
              className="text-center mt-4 text-sm"
              style={{ color: '#000000' }}
            >
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                style={{ color: '#FF3131', textDecoration: 'underline' }}
              >
                Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
