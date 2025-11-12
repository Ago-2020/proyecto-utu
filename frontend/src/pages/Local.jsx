import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import ReviewCard from '@/components/ReviewCard'
import ProductCard from '@/components/ProductCard'
import NewReview from '@/components/NewReview'
import { useAuth } from '@/AuthProvider'
import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import defaultBanner from '@/img/defaultBanner.png'

export default function Local() {
  const { token } = useAuth()
  const { id } = useParams()
  const [local, setLocal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [redes, setRedes] = useState([])
  const [productos, setProductos] = useState([])
  const [reseñas, setReseñas] = useState([])

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Debe iniciar sesión para eliminar una reseña.')

    if (!window.confirm('¿Seguro que quieres eliminar esta reseña?')) return

    try {
      const res = await fetch(`http://localhost:8000/api/shops/${id}/review`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (res.ok) {
        alert('Reseña eliminada con éxito')
        setReseñas((prev) => prev.filter((r) => r.id_resena !== reviewId))
      } else {
        alert(data.message || 'Error al eliminar la reseña')
      }
    } catch (error) {
      console.error('Error al eliminar la reseña:', error)
      alert('Error de conexión con el servidor')
    }
  }

  const handleLike = async (id_resena, willLike) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/shops/${id}/review/${id_resena}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const data = await response.json()

      if (data.success) {
        // Actualizar likes en la lista de reseñas localmente
        setReseñas((prev) =>
          prev.map((r) =>
            r.id_resena === id_resena
              ? { ...r, likes: r.likes + (data.liked ? 1 : -1) }
              : r,
          ),
        )
      } else {
        alert(data.message || 'Error al dar like')
      }
    } catch (err) {
      console.error('Error al dar like:', err)
    }
  }

  const handleSubmit = async ({ estrellas, comentario }) => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Debe iniciar sesión para enviar una reseña.')

    try {
      const res = await fetch(`http://localhost:8000/api/shops/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estrellas, comentario }),
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        console.error('Respuesta no JSON:', text)
        throw new Error('El servidor no devolvió JSON válido')
      }

      if (res.ok) {
        alert('Reseña enviada correctamente 🎉')
        window.location.reload()
      } else {
        alert(data.message || 'Error al enviar la reseña')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión con el servidor')
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

        const [localRes, reviewRes, productRes, socialsRes] = await Promise.all(
          [
            fetch(`http://localhost:8000/api/shops/${id}`).then((r) =>
              r.json(),
            ),
            fetch(`http://localhost:8000/api/shops/${id}/review`, {
              headers: authHeader,
            }).then((r) => r.json()),
            fetch(`http://localhost:8000/api/shops/${id}/products`).then((r) =>
              r.json(),
            ),
            fetch(`http://localhost:8000/api/shops/${id}/socials`).then((r) =>
              r.json(),
            ),
          ],
        )

        setLocal(localRes)

        if (Array.isArray(reviewRes)) {
          setReseñas(reviewRes)
        } else {
          console.warn('Respuesta inesperada del backend (reseñas):', reviewRes)
          setReseñas([])
        }
        setRedes(Array.isArray(socialsRes) ? socialsRes : [])
        setProductos(productRes)
      } catch (err) {
        console.error('Error al cargar datos:', err)
        setError('Hubo un error al cargar los datos del local.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, token])

  if (loading) return <div className="p-10 text-center">Cargando local...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>
  if (!local)
    return <div className="p-10 text-center">No se encontró el local.</div>

  const logoURL = `http://localhost:8000/api/getimg.php?file=${local.logo}`
  const bannerURL = local.banner
    ? `http://localhost:8000/api/getimg.php?file=${local.banner}`
    : defaultBanner

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Banner grande */}
      <div
        className="relative w-full h-[600px] md:h-[200px] lg:h-[450px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerURL})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        {/* Info del local */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between text-white">
          <div className="flex items-center gap-6">
            <img
              src={logoURL}
              alt="Perfil del local"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h1 className="text-4xl font-bold drop-shadow-lg">
                {local.nombre_local}
              </h1>
              <p className="text-sm text-gray-200">{local.slogan}</p>
              <p className="text-sm mt-1 text-gray-200">📍 {local.ubicacion}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 justify-end">
            <p className="text-gray-200 font-medium">📞 {local.numero}</p>
            {redes.length > 0 ? (
              redes.map((r) => (
                <a
                  key={r.id_red}
                  href={r.url_perfil}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-200 hover:text-red-400 transition"
                >
                  {r.id_tipored === 1 && <FaFacebook />}
                  {r.id_tipored === 2 && <FaInstagram />}
                  {r.id_tipored === 3 && <FaTwitter />}
                  {r.id_tipored === 4 && <FaYoutube />}
                  {!r.id_tipored && <FaLink />}
                  <span>{r.nombre_red}</span>
                </a>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Sin redes sociales</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-center gap-12 py-4 text-gray-600 font-medium">
          <button className="text-red-600 border-b-2 border-red-600 pb-1 transition">
            Reseñas y Publicaciones
          </button>
        </div>
      </div>

      {/* Contenido */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16">
        {/* Productos */}
        <section className="mb-16 w-full text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 text-center">
            Productos del Local
          </h2>
          <p className="text-gray-600 mb-10 text-center">
            Descubrí nuestros sabores caseros, preparados con amor y dedicación.
          </p>

          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.id_producto}
                  titulo={producto.titulo}
                  descripcion={producto.descripcion_producto}
                  precio={producto.precio}
                  foto={producto.foto}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center w-full mb-10">
              No hay productos disponibles en este local.
            </p>
          )}
        </section>

        {/* Reseñas */}
        <section className="w-full text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 text-center">
            Reseñas del Local
          </h2>

          {/* Formulario de nueva reseña */}
          {token && <NewReview onSubmit={handleSubmit} />}
          {!token && (
            <p className="mb-4">
              <Link to="/login" className="text-red-600 font-medium">
                Inicia sesión
              </Link>{' '}
              para dejar una reseña.
            </p>
          )}

          <div className="space-y-6 max-w-3xl mx-auto mt-6">
            {reseñas.length === 0 ? (
              <p className="text-gray-600 text-center">
                Este local aún no tiene reseñas.
              </p>
            ) : (
              reseñas.map((review) => (
                <ReviewCard
                  key={review.id_resena}
                  review={review}
                  currentUserId={localStorage.getItem('userId')}
                  onDelete={handleDelete}
                  onLike={handleLike}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
