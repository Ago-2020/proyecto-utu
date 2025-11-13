import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ShopSocials() {
  const { id } = useParams()
  const [socials, setSocials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/shops/${id}/socials`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        setSocials(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchSocials()
  }, [id])

  const handleDelete = async (id_red) => {
    if (!window.confirm('¿Estás seguro de eliminar esta red social?')) return

    try {
      const res = await fetch(
        `http://localhost:8000/api/shops/socials/${id_red}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      const text = await res.text()
      const data = text ? JSON.parse(text) : {}
      if (res.ok) {
        alert(data.message || 'Red social eliminada correctamente')
        setSocials((prev) => prev.filter((s) => s.id_red !== id_red))
      } else {
        alert(data.error || data.message || 'Error al eliminar la red social')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión: ' + err.message)
    }
  }

  const scaleFactor = 0.95

  return (
    <div className="flex flex-1 min-h-screen bg-gray-100">
      <div className="flex flex-1 justify-center items-start pt-6 sm:pt-10 pb-6 overflow-auto">
        <main
          className="bg-white shadow-xl rounded-3xl flex flex-col items-center w-full max-w-[1200px] px-6 sm:px-10 lg:px-16"
          style={{
            paddingTop: `${4 * scaleFactor}rem`,
            paddingBottom: `${4 * scaleFactor}rem`,
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
            Redes Sociales del Local
          </h2>
          <Link
            to={`/profile/newsocial/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all text-sm sm:text-base shadow-md mb-6"
          >
            + Red social
          </Link>

          {loading ? (
            <p className="text-gray-500 text-center py-10">Cargando redes sociales...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : socials.length === 0 ? (
            <p className="text-gray-600 text-center py-10">
              No hay redes sociales registradas.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full">
              {socials.map((s) => (
                <div
                  key={s.id_red}
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-md p-4 w-full max-w-xs hover:shadow-xl transition duration-300"
                >
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{s.nombre_red}</h3>
                  <p className="text-blue-600 text-sm mt-2 line-clamp-2 break-words">
                    <a href={s.url_perfil} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {s.url_perfil}
                    </a>
                  </p>
                  <button
                    onClick={() => handleDelete(s.id_red)}
                    className="mt-4 w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
