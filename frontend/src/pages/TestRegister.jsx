import React, { useState } from 'react'

export default function Register() {
  const [nombre_usuario, setNombre] = useState('')
  const [email_usuario, setEmail] = useState('')
  const [password_usuario, setPassword] = useState('')
  const [tipo_usuario, setTipo] = useState('')
  const [response, setResponse] = useState(null)

  const cuandoCambiaTipo = (e) => {
    setTipo(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = {
      nombre_usuario: nombre_usuario,
      email_usuario: email_usuario,
      password_usuario: password_usuario,
      tipo_usuario: tipo_usuario,
    }

    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log(formData)
      console.log(res)

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error('Error:', error)
      setResponse({ success: false, message: 'Error en la conexión' })
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          type="text"
          placeholder="Nombre"
          value={nombre_usuario}
          onChange={(e) => setNombre(e.target.value)}
        />
        <br />
        <input
          name="email"
          type="email"
          placeholder="Correo"
          value={email_usuario}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={password_usuario}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <div>
          <input
            type="radio"
            name="tipo_usuario"
            id="Cliente"
            value="2"
            checked={tipo_usuario === '2'}
            onChange={cuandoCambiaTipo}
          />
          <label htmlFor="Cliente">Cliente</label>
          <br />
          <input
            type="radio"
            name="tipo_usuario"
            id="emprendedor"
            value="3"
            checked={tipo_usuario === '3'}
            onChange={cuandoCambiaTipo}
          />
          <label htmlFor="emprendedor">Emprendedor</label>
        </div>
        <br />
        <button type="submit">Registrar</button>
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
