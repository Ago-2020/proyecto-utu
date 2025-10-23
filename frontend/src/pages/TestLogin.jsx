import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
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
        navigate('/')
      } else {
        console.error('No se recibió token válido:', data)
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse({ success: false, message: 'Error en la conexión' })
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <br />
        <input
          type="email"
          placeholder="Correo"
          value={email_usuario}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password_usuario}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Ingresar</button>
      </form>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Respuesta del servidor:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
