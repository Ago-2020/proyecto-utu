import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'

export default function NewPublication() {
  const { id } = useParams() // ID del local
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    etiqueta_producto: '',
    foto: null,
  })

  const [preview, setPreview] = useState(null)

  // Lista de etiquetas predefinidas
  const etiquetas = [
    { id: 1, nombre: 'Postre' },
    { id: 2, nombre: 'Bebidas' },
    { id: 3, nombre: 'Merienda' },
    { id: 4, nombre: 'Aperitivos' },
    { id: 5, nombre: 'Desayuno' },
    { id: 6, nombre: 'Panaderia' },
    { id: 7, nombre: 'Reposteria' },
    { id: 8, nombre: 'Sin Gluten' },
    { id: 9, nombre: 'Ensaladas' },
    { id: 10, nombre: 'Helados' },
    { id: 11, nombre: 'Vegana' },
    { id: 12, nombre: 'Vegetariana' },
    { id: 13, nombre: 'Sandwiches' },
    { id: 14, nombre: 'Hamburguesas' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm({ ...form, foto: file })

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.titulo ||
      !form.descripcion ||
      form.precio <= 0 ||
      !form.etiqueta_producto
    ) {
      return alert(
        'Todos los campos son obligatorios y el precio debe ser mayor que 0',
      )
    }

    const token = localStorage.getItem('token')
    if (!token)
      return alert('Debe iniciar sesión para registrar una publicación.')

    const formData = new FormData()
    formData.append('titulo', form.titulo)
    formData.append('descripcion', form.descripcion)
    formData.append('precio', form.precio)
    formData.append('etiqueta_producto', form.etiqueta_producto)
    if (form.foto) formData.append('foto', form.foto)

    try {
      const res = await fetch(
        `http://localhost:8000/api/shops/${id}/products`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      )

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        console.error('Respuesta no JSON:', text)
        throw new Error('Respuesta inválida del servidor')
      }

      if (res.ok) {
        alert('Producto registrado correctamente!')
        window.location.href = '/profile/myshops'
      } else {
        alert(data.message || 'Error al registrar el producto')
      }
    } catch (error) {
      console.error('Error de conexión o parseo:', error)
      alert('Error al registrar el producto.')
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-6xl flex flex-col md:flex-row gap-10">
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 grid grid-cols-1 gap-6"
          encType="multipart/form-data"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ingrese el título"
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <input
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ingrese la descripción"
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Precio
            </label>
            <input
              type="number"
              name="precio"
              min="1"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ingrese precio mayor que 0"
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
              required
            />
          </div>

          {/* Select de etiqueta */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Etiqueta
            </label>
            <select
              name="etiqueta_producto"
              value={form.etiqueta_producto}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
              required
            >
              <option value="">Seleccione una etiqueta</option>
              {etiquetas.map((etiqueta) => (
                <option key={etiqueta.id} value={etiqueta.id}>
                  {etiqueta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Imagen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-16 py-4 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              Guardar Producto
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Preview del Producto
          </h2>
          <ProductCard
            titulo={form.titulo}
            descripcion={form.descripcion}
            precio={form.precio > 0 ? form.precio : ''}
            foto={preview}
          />
        </div>
      </main>
    </div>
  )
}
