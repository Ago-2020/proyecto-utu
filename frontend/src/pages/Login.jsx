import { Link, useNavigate } from 'react-router-dom'
import kyotoImage from '@/img/AuthBackground.webp'
import logo from '../img/logo.png'
import React, { useState } from 'react'

export default function Login() {
  const [email_usuario, setEmail] = useState('')
  const [password_usuario, setPassword] = useState('')
  const [response, setResponse] = useState(null)
  const navigate = useNavigate()

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

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.id_usuario)
        navigate('/')
      } else {
        setResponse({
          success: false,
          message: data.message || 'Credenciales incorrectas',
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse({ success: false, message: 'Error en la conexión' })
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Fondo full-screen */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${kyotoImage})` }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-black/20"></div>
      </div>

      {/* Logo */}
      <Link to="/">
        <img
          src={logo}
          alt="Logo"
          className="z-50 rounded-xl border-2"
          style={{
            width: '60px',
            height: '60px',
            position: 'absolute',
            borderColor: '#FF3131',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'pointer',
          }}
        />
      </Link>

      {/* Contenedor formulario */}
      <div className="z-10 flex flex-col items-center justify-center w-full px-4 py-8">
        <div
          className="bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-black p-6 md:p-10"
          style={{ marginTop: '100px', marginBottom: '50px' }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-black">
            Iniciar Sesión
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                style={{ borderColor: '#5D5D5D', color: '#5D5D5D' }}
                required
                value={email_usuario}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Escribe tu contraseña"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                style={{ borderColor: '#5D5D5D', color: '#5D5D5D' }}
                required
                value={password_usuario}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-bold mt-4 transition transform hover:scale-105 hover:brightness-110"
              style={{ background: 'linear-gradient(90deg, #FF3131, #C31313)' }}
            >
              Iniciar Sesión
            </button>

            <div className="text-center mt-4 text-sm text-black">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                style={{ color: '#FF3131', textDecoration: 'underline' }}
              >
                Regístrate
              </Link>
            </div>

            {response && (
              <div
                className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                  response.success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {response.message ||
                  (response.success
                    ? 'Inicio de sesión exitoso'
                    : 'Error en el inicio de sesión')}
              </div>
            )}
          </form>
        </div>
      </div>

      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}
      </style>
    </div>
  )
}
