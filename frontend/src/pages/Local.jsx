import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FaStar, FaRegStar, FaUser, FaHeart } from 'react-icons/fa'
import cardImage from '@/img/card.jpg'
import banner from '@/img/caption.jpg'
import profile_example from '@/img/profilepro.jpg'
import ReviewCard from '@/components/ReviewCard'

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Local() {
  const { id } = useParams()
  const [local, setLocal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reseñas, setReseñas] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [localRes, reviewRes] = await Promise.all([
          fetch(`http://localhost:8000/api/shops/${id}`).then((r) => r.json()),
          fetch(`http://localhost:8000/api/shops/${id}/review`).then((r) =>
            r.json(),
          ),
        ])

        setLocal(localRes)
        setReseñas(reviewRes)
      } catch (err) {
        console.error('Error al cargar datos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <div className="p-10 text-center">Cargando local...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>
  if (!local)
    return <div className="p-10 text-center">No se encontró el local.</div>

  const productos = [
    {
      id: 1,
      nombre: 'Muffin artesanal',
      descripcion: 'Delicioso muffin de vainilla con chips de chocolate.',
      precio: 120,
      imagen: cardImage,
      etiqueta: 'Café',
    },
    {
      id: 2,
      nombre: 'Tarta de frutilla',
      descripcion: 'Base crocante con crema pastelera y frutillas frescas.',
      precio: 180,
      imagen: cardImage,
      etiqueta: 'Postre',
    },
    {
      id: 3,
      nombre: 'Budín casero',
      descripcion: 'Suave, esponjoso y con el toque justo de limón.',
      precio: 150,
      imagen: cardImage,
      etiqueta: 'Dulce',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Banner grande con degradado oscuro */}
      <div
        className="relative w-full h-[600px] md:h-[200px] lg:h-[450px] bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        {/* Info del local */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between text-white">
          <div className="flex items-center gap-6">
            <img
              src={profile_example}
              alt="Perfil del local"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h1 className="text-4xl font-bold drop-shadow-lg">
                {local.nombre_local}
              </h1>
              <p className="text-sm text-gray-200">
                Restaurante familiar — Parrillada & Pastas
              </p>
              <p className="text-sm mt-1 text-gray-200">📍 {local.ubicacion}</p>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 text-right">
            <p className="text-gray-200 font-medium">📞 +598 99 123 456</p>
            <p className="text-gray-200 font-medium">
              @instagramejemploeldesafio.uy
            </p>
            <p className="bg-red-600 px-4 py-2 mt-2 inline-block rounded-lg font-medium shadow-md">
              Abierto ahora
            </p>
          </div>
        </div>
      </div>

      {/* Tabs centradas */}
      <div className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-center gap-12 py-4 text-gray-600 font-medium">
          <button className="text-red-600 border-b-2 border-red-600 pb-1 transition">
            Reseñas y Publicaciones
          </button>
          <button className="hover:text-red-600 transition">Descripción</button>
        </div>
      </div>

      {/* Contenido */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16">
        {/* Productos del Local */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Productos del Local
          </h2>
          <p className="text-gray-600 mb-10">
            Descubrí nuestros sabores caseros, preparados con amor y dedicación.
          </p>

          {/* Publicaciones tipo tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white border border-gray-200 shadow-lg rounded-2xl w-[380px] h-[460px] flex flex-col overflow-hidden"
              >
                {/* Etiqueta centrada */}
                <div className="p-4 flex justify-center">
                  <span
                    style={{
                      backgroundColor: '#ffe2e2ff',
                      color: '#A83434',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                    }}
                  >
                    {producto.etiqueta}
                  </span>
                </div>

                {/* Imagen reducida y centrada */}
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-[320px] h-[200px] object-cover mx-auto rounded-lg"
                />

                {/* Contenido */}
                <div className="px-6 py-4 flex justify-between items-start flex-1">
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 w-60">
                      {producto.descripcion}
                    </p>
                  </div>
                  <p className="text-red-600 font-bold text-lg">
                    ${producto.precio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reseñas del Local */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-900">
            Reseñas del Local
            <div className="space-y-6 max-w-3xl mx-auto">
              {/*Tabla de ejemplo*/}

              {reseñas.length === 0 ? (
                <p className="text-gray-600">
                  Este local aún no tiene reseñas.
                </p>
              ) : (
                reseñas.map((review) => (
                  // ✅ aquí review sí está definido porque lo pasamos como parámetro
                  <ReviewCard key={review.id_resena} review={review} />
                ))
              )}
            </div>
          </h2>
        </section>
      </main>
    </div>
  )
}
