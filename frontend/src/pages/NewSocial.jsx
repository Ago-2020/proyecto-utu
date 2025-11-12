import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function NewSocial() {
  const { id } = useParams()
  const [form, setForm] = useState({
    id_tipored: '',
    nombre_red: '',
    url_perfil: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Debe iniciar sesión para agregar una red social')
      return
    }

    const body = {
      id_tipored: form.id_tipored,
      nombre_red: form.nombre_red,
      url_perfil: form.url_perfil,
    }

    try {
      const res = await fetch(`http://localhost:8000/api/shops/${id}/socials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error('Respuesta inválida del servidor')
      }

      if (res.ok) {
        alert(data.message || 'Red social agregada correctamente')
        window.location.href = `/profile/myshops`
      } else {
        alert(data.error || 'Error al agregar la red social')
      }
    } catch (error) {
      console.error('Error de conexión:', error)
      alert('Error al registrar la red social.')
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Agregar red social</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Select para tipo de red */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de red
            </label>
            <select
              name="id_tipored"
              value={form.id_tipored}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              required
            >
              <option value="">Seleccione una red</option>
              <option value="1">Facebook</option>
              <option value="2">Instagram</option>
              <option value="3">Twitter</option>
              <option value="4">Youtube</option>
            </select>
          </div>

          {/* Nombre de usuario */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre de usuario o red
            </label>
            <input
              type="text"
              name="nombre_red"
              value={form.nombre_red}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              placeholder="@mi_local_uy"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              URL del perfil
            </label>
            <input
              type="url"
              name="url_perfil"
              value={form.url_perfil}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
              placeholder="https://www.instagram.com/mi_local_uy/"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Guardar Red Social
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
