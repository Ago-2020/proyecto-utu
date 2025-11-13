import { Link } from 'react-router-dom'
import kyotoImage from '@/img/AuthBackground.webp'
import logo from '../img/logo.png'
import React, { useState } from 'react'

export default function Register() {
  const [nombre_usuario, setNombre] = useState('')
  const [email_usuario, setEmail] = useState('')
  const [password_usuario, setPassword] = useState('')
  const [tipo_usuario, setTipoUsuario] = useState('2')
  const [response, setResponse] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_usuario,
          email_usuario,
          password_usuario,
          tipo_usuario,
        }),
      })

      // Mostrar información del status
      console.log('Status:', res.status, res.statusText)

      const data = await res.json()
      setResponse(data)

      if (res.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        setNombre('')
        setEmail('')
        setPassword('')
      }
    } catch (error) {
      console.error('Error en la conexión con el backend:', error)
      setResponse({
        success: false,
        message: 'Error en la conexión con el backend',
      })
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Fondo full-screen */}
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{ backgroundImage: `url(${kyotoImage})` }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-black/20"></div>
      </div>

      {/* Logo responsive */}
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
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fade-in">
              <div
                className="bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 border border-green-500"
                style={{
                  minWidth: '280px',
                  textAlign: 'center',
                  animation: 'pop 0.3s ease',
                }}
              >
                <div className="text-green-600 text-5xl mb-3">:D</div>
                <h3 className="text-xl font-bold text-green-700 mb-1">
                  ¡Usuario registrado!
                </h3>
                <p className="text-gray-600 text-sm">
                  Tu cuenta fue creada con éxito
                </p>
              </div>
            </div>
          )}

          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-black">
            Registro de Usuario
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
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

            {/* Nombre de usuario */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Nombre de usuario
              </label>
              <input
                type="text"
                placeholder="Tu nombre de usuario"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                style={{ borderColor: '#5D5D5D', color: '#5D5D5D' }}
                required
                value={nombre_usuario}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            {/* Contraseña */}
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

            {/* Tipo de usuario (Normal / Emprendedor) */}
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Soy:
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipo_usuario"
                    value="2"
                    checked={tipo_usuario === '2'}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                    className="h-4 w-4"
                  />
                  <span>Usuario normal</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipo_usuario"
                    value="3"
                    checked={tipo_usuario === '3'}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                    className="h-4 w-4"
                  />
                  <span>Emprendedor</span>
                </label>
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-center justify-center mt-4">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded focus:outline-none"
                style={{ accentColor: '#FF3131', borderColor: '#C31313' }}
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-black">
                Acepto los{' '}
                <a
                  href="/terms"
                  style={{ color: '#FF3131', textDecoration: 'underline' }}
                >
                  Términos y Condiciones
                </a>
              </label>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-bold mt-4 transition transform hover:scale-105 hover:brightness-110"
              style={{ background: 'linear-gradient(90deg, #FF3131, #C31313)' }}
            >
              Regístrate ahora
            </button>

            {/* Link a login */}
            <div className="text-center mt-4 text-sm text-black">
              ¿Ya tenés una cuenta?{' '}
              <Link
                to="/login"
                style={{ color: '#FF3131', textDecoration: 'underline' }}
              >
                Iniciar sesión
              </Link>
            </div>

            {/* Mensaje de error o respuesta */}
            {response && !response.success && (
              <p className="mt-2 text-center text-red-600">
                {response.message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Animaciones */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}
