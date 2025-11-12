import { useState, useEffect } from 'react'

export default function EditShop({ shopId, token }) {
  const [form, setForm] = useState({
    nombre_local: '',
    ubicacion: '',
    descripcion: '',
    slogan: '',
    numero: '',
    logo: null,
    banner: null,
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Cargar datos iniciales del local (opcional)
  useEffect(() => {
    fetch(`http://localhost:8000/api/shops/${shopId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm((prev) => ({
            ...prev,
            ...data.shop,
          }))
        }
      })
  }, [shopId, token])

  // Manejar cambios de inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('nombre_local', form.nombre_local)
    formData.append('ubicacion', form.ubicacion)
    formData.append('descripcion', form.descripcion || '')
    formData.append('slogan', form.slogan || '')
    formData.append('numero', form.numero || '')
    if (form.logo) formData.append('logo', form.logo)
    if (form.banner) formData.append('banner', form.banner)
    // Simular PUT con POST
    formData.append('_method', 'PUT')

    try {
      const res = await fetch(`http://localhost:8000/api/shops/${shopId}`, {
        method: 'POST', // form-data no funciona con PUT puro
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      setMessage(data.message)
    } catch (err) {
      console.error(err)
      setMessage('Error al actualizar el local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Editar Local</h2>

      <label className="block mb-2">
        Nombre del local*
        <input
          type="text"
          name="nombre_local"
          value={form.nombre_local}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </label>

      <label className="block mb-2">
        Ubicación*
        <input
          type="text"
          name="ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </label>

      <label className="block mb-2">
        Descripción
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-2">
        Slogan
        <input
          type="text"
          name="slogan"
          value={form.slogan}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-2">
        Número
        <input
          type="text"
          name="numero"
          value={form.numero}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-2">
        Logo
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </label>

      <label className="block mb-4">
        Banner
        <input
          type="file"
          name="banner"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? 'Actualizando...' : 'Actualizar Local'}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  )
}
