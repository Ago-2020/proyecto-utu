import { Link } from 'react-router-dom'
import leftImage from '../img/izquierda.png'
import logo from '../img/logo.png'
import React, { useState } from 'react'

export default function Register() {
  const [nombre_usuario, setNombre] = useState('')
  const [email_usuario, setEmail] = useState('')
  const [password_usuario, setPassword] = useState('')
  const [tipo_usuario, setTipo] = useState('')
  const [response, setResponse] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_usuario,
          email_usuario,
          password_usuario,
          tipo_usuario: '1',
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
            Registro de Usuario
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

            {/* Nombre de usuario */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: '#5D5D5D' }}
              >
                Nombre de usuario
              </label>
              <input
                type="text"
                placeholder="Tu nombre de usuario"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: '#5D5D5D', color: '#5D5D5D' }}
                required
                value={nombre_usuario}
                onChange={(e) => setNombre(e.target.value)}
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

            {/* Confirmar Contraseña */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: '#5D5D5D' }}
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="Vuelve a escribir tu contraseña"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: '#5D5D5D', color: '#5D5D5D' }}
                required
              />
            </div>

            {/* Casilla de términos */}
            <div className="flex items-center justify-center mt-4">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded focus:outline-none"
                style={{ accentColor: '#FF3131', borderColor: '#C31313' }}
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 text-sm"
                style={{ color: '#000000' }}
              >
                Acepto los{' '}
                <a
                  href="/terminos"
                  style={{ color: '#FF3131', textDecoration: 'underline' }}
                >
                  Términos y Condiciones
                </a>
              </label>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-bold mt-4"
              style={{ background: 'linear-gradient(90deg, #FF3131, #C31313)' }}
            >
              Regístrate ahora
            </button>

            {/* Botón de Google */}
            <button
              type="button"
              className="w-full py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2 font-medium mt-2 hover:bg-gray-100 transition"
              style={{ background: 'linear-gradient(90deg, #FF3131, #C31313)' }}
            >
              <img
                src="https://www.svgrepo.com/show/380993/google-logo-search-new.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Iniciar con Google
            </button>

            {/* Link a login */}
            <div
              className="text-center mt-4 text-sm"
              style={{ color: '#000000' }}
            >
              ¿Ya tenés una cuenta?{' '}
              <Link
                to="/login"
                style={{ color: '#FF3131', textDecoration: 'underline' }}
              >
                Iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
