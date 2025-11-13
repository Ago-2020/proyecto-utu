import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/AuthProvider'

export default function EditShop({ shopId }) {
  const { token } = useAuth()
  const { id } = useParams()
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

  // Previews
  const [logoPreview, setLogoPreview] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)

  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:8000/api/shops/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm((prev) => ({ ...prev, ...data.shop }))
          if (data.shop.logo) setLogoPreview(data.shop.logo)
          if (data.shop.banner) setBannerPreview(data.shop.banner)
        }
      })
  }, [id, token])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }))
      if (name === 'logo') setLogoPreview(URL.createObjectURL(files[0]))
      if (name === 'banner') setBannerPreview(URL.createObjectURL(files[0]))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('nombre_local', form.nombre_local)
    formData.append('ubicacion', form.ubicacion)
    formData.append('descripcion', form.descripcion || '')
    formData.append('slogan', form.slogan || '')
    formData.append('numero', form.numero || '')
    if (form.logo instanceof File) formData.append('logo', form.logo)
    if (form.banner instanceof File) formData.append('banner', form.banner)
    formData.append('_method', 'PUT')

    try {
      const res = await fetch(`http://localhost:8000/api/shops/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}
      if (res.ok && data.success) {
        setMessage('Local actualizado con éxito!')
      } else {
        setMessage(data.message || 'Error al actualizar')
      }
    } catch (error) {
      console.error(error)
      setMessage('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4 sm:space-y-6"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Editar Local</h2>

      {/* Nombre y Ubicación en grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          Nombre del local*
          <input
            type="text"
            name="nombre_local"
            value={form.nombre_local}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            required
          />
        </label>

        <label className="block">
          Ubicación*
          <input
            type="text"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            required
          />
        </label>
      </div>

      <label className="block">
        Descripción
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md p-2 resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          rows={4}
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          Slogan
          <input
            type="text"
            name="slogan"
            value={form.slogan}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          />
        </label>

        <label className="block">
          Número
          <input
            type="text"
            name="numero"
            value={form.numero}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          />
        </label>
      </div>

      {/* Logo con preview */}
      <label className="block">
        Logo
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Logo preview"
            className="mt-2 w-24 h-24 object-cover rounded border"
          />
        )}
      </label>

      {/* Banner con preview */}
      <label className="block">
        Banner
        <input
          type="file"
          name="banner"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
        {bannerPreview && (
          <img
            src={bannerPreview}
            alt="Banner preview"
            className="mt-2 w-full max-h-40 object-cover rounded border"
          />
        )}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Actualizando...' : 'Actualizar Local'}
      </button>

      {message && (
        <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
      )}
    </form>
  )
}
