import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import '@/main.css'

export default function ShopSocials() {
  const { id } = useParams() // 🔹 obtiene el parámetro desde la URL
  const [socials, setSocials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('📡 id recibido:', id)
    const fetchSocials = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/shops/${id}/socials`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        const text = await res.text()
        console.log('🧾 Respuesta cruda:', text)
        const data = text ? JSON.parse(text) : []
        setSocials(data)
      } catch (err) {
        console.error('Error en fetchSocials:', err)
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
        },
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
      console.error('Error al eliminar la red social:', err)
      alert('Error de conexión: ' + err.message)
    }
  }

  if (loading) return <p>Cargando redes sociales...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full h-full max-w-6xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Redes Sociales del Local</h2>
          <Link
            to={`/profile/newsocial/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Red social
          </Link>
          {socials.length === 0 ? (
            <p>No hay redes sociales registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre Red</th>
                    <th>URL</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {socials.map((s) => (
                    <tr key={s.id_red}>
                      <td>{s.id_red}</td>
                      <td>{s.nombre_red}</td>
                      <td>
                        <a
                          href={s.url_perfil}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {s.url_perfil}
                        </a>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleDelete(s.id_red)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all transform hover:scale-105"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
