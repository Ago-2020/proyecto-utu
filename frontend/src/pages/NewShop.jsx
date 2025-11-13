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
      const res = await fetch('http://localhost:8000/api/shops/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        alert('Local registrado correctamente 🎉')
        window.location.href = '/profile/myshops'
      } else {
        alert(data.message || 'Error al registrar el local')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión con el servidor')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1 justify-center items-center px-4 py-6 sm:py-10 overflow-auto">
        <main className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-4xl md:max-w-5xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-red-600">
            Registro de Nuevo Local
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
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
                  className="text-sm font-medium text-gray-700 mb-1 sm:mb-2"
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
                  className="border border-gray-300 rounded-lg p-3 sm:p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition text-sm sm:text-base"
                />
              </div>
            ))}

            {/* Logo */}
            <div className="flex flex-col">
              <label
                htmlFor="logo"
                className="text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Logo del Local
              </label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm sm:text-base"
              />
            </div>

            {/* Banner */}
            <div className="flex flex-col">
              <label
                htmlFor="banner"
                className="text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Banner del Local
              </label>
              <input
                id="banner"
                name="banner"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm sm:text-base"
              />
            </div>

            {/* Botón de guardar */}
            <div className="sm:col-span-2 flex justify-center mt-4 sm:mt-6">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-10 sm:px-16 py-3 sm:py-4 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105 text-sm sm:text-base"
              >
                Guardar Local
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
