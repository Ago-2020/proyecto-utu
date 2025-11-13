import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/AuthProvider'
import { FaSave } from 'react-icons/fa'

export default function EditShop() {
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
  const [errors, setErrors] = useState({})
  const [logoPreview, setLogoPreview] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
    setErrors((prev) => ({ ...prev, [name]: '' }))
    if (files) {
      setForm({ ...form, [name]: files[0] })
      if (name === 'logo') setLogoPreview(URL.createObjectURL(files[0]))
      if (name === 'banner') setBannerPreview(URL.createObjectURL(files[0]))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const validate = () => {
    let newErrors = {}
    if (!form.nombre_local) newErrors.nombre_local = 'El nombre del local es obligatorio'
    if (!form.ubicacion) newErrors.ubicacion = 'La ubicación es obligatoria'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

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
        setMessage('✅ Local actualizado con éxito!')
      } else {
        setMessage(`⚠️ ${data.message || 'Error al actualizar'}`)
      }
    } catch (error) {
      console.error(error)
      setMessage('⚠️ Error de conexión con el servidor')
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(''), 4000)
    }
  }

  return (
    <div className="flex flex-1 min-h-screen bg-gray-100">
      <div className="flex flex-1 justify-center items-start p-4 overflow-auto pt-6">
        <main className="bg-white shadow-2xl rounded-3xl flex flex-col items-center w-full max-w-[900px] px-6 sm:px-10 lg:px-16 py-10">
          <h1 className="font-bold text-center mb-10 text-3xl sm:text-4xl text-red-600">
            Editar Local
          </h1>

          {message && (
            <div className="mb-6 w-full text-center text-sm sm:text-base font-medium p-3 rounded-lg bg-red-100 text-red-700 animate-pulse">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
            encType="multipart/form-data"
          >
            {[
              ['nombre_local', 'Nombre del Local*'],
              ['ubicacion', 'Ubicación*'],
              ['descripcion', 'Descripción del Local'],
              ['slogan', 'Slogan o frase corta'],
              ['numero', 'Número de contacto'],
            ].map(([name, label]) => (
              <div key={name} className="flex flex-col relative">
                <label className="text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  {label}
                </label>
                {name === 'descripcion' ? (
                  <textarea
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={`Ingrese ${label.toLowerCase()}`}
                    rows={4}
                    className={`border rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition text-sm sm:text-base resize-none ${
                      errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={`Ingrese ${label.toLowerCase()}`}
                    className={`border rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition text-sm sm:text-base ${
                      errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
                {errors[name] && (
                  <span className="text-red-600 text-xs mt-1 absolute bottom-[-1.2rem]">
                    {errors[name]}
                  </span>
                )}
              </div>
            ))}

            {/* Sección de imágenes */}
            <div className="sm:col-span-2 flex flex-col gap-4">
              {/* Logo */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Logo del Local
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="mt-4 w-32 h-32 object-cover rounded-full border-2 border-gray-200 shadow-lg"
                  />
                )}
              </div>

              {/* Banner */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Banner del Local
                </label>
                <input
                  type="file"
                  name="banner"
                  accept="image/*"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                />
                {bannerPreview && (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="mt-4 w-full max-h-48 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                  />
                )}
              </div>
            </div>

            {/* Botón de guardar */}
            <div className="sm:col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-12 sm:px-16 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50"
              >
                <FaSave /> {loading ? 'Actualizando...' : 'Actualizar Local'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
