import React, { useState } from 'react'

export default function NewShop() {
  const [form, setForm] = useState({
    nombre_local: '',
    ubicacion: '',
    descripcion: '',
    slogan: '',
    numero: '',
    etiquetas: '',
    logo: null,
    banner: null,
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return alert('Debe iniciar sesión para registrar un local.')

    const formData = new FormData()
    for (const key in form) {
      formData.append(key, form[key])
    }

    try {
      const res = await fetch('http://localhost:8000/api/locales/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        alert('Local registrado correctamente 🎉')
        window.location.href = '/perfil'
      } else {
        alert(data.message || 'Error al registrar el local')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión con el servidor')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-6xl">
        <h1 className="text-4xl font-semibold text-center mb-10 text-red-600">
          Registro de Nuevo Local
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          encType="multipart/form-data"
        >
          {[
            ['nombre_local', 'Nombre del Local'],
            ['ubicacion', 'Ubicación'],
            ['descripcion', 'Descripción del Local'],
            ['slogan', 'Slogan o frase corta'],
            ['numero', 'Número de contacto'],
            ['etiquetas', 'Etiquetas (separadas por comas)'],
          ].map(([name, label]) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="text-sm font-medium text-gray-700 mb-2"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type="text"
                value={form[name]}
                onChange={handleChange}
                placeholder={`Ingrese ${label.toLowerCase()}`}
                className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
              />
            </div>
          ))}

          {/* Logo */}
          <div className="flex flex-col">
            <label
              htmlFor="logo"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Logo del Local
            </label>
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </div>

          {/* Banner */}
          <div className="flex flex-col">
            <label
              htmlFor="banner"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Banner del Local
            </label>
            <input
              id="banner"
              name="banner"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-16 py-4 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              Guardar Local
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
