import React, { useEffect, useState } from 'react'
import ShopCard from '@/components/ShopCard'
import { useAuth } from '@/AuthProvider'
import { Link } from 'react-router-dom'

export default function MyShops() {
  const { token } = useAuth()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token === undefined) return
    if (!token) {
      console.warn('No hay token, no se puede obtener locales')
      setLoading(false)
      return
    }

    const fetchShops = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/shops', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401) {
          console.error('Token inválido o expirado.')
          setLoading(false)
          return
        }

        const data = await res.json()
        const normalized = data.map((shop) => ({
          ...shop,
          etiquetas: shop.etiquetas
            ? shop.etiquetas.split(',').map((t) => t.trim())
            : [],
        }))
        setShops(normalized)
      } catch (error) {
        console.error('Error al obtener locales:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [token])

  const handleDelete = async (id_local) => {
    if (!window.confirm('¿Seguro que querés eliminar este local?')) return

    try {
      const res = await fetch(`http://localhost:8000/api/shops/${id_local}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        setShops((prev) => prev.filter((shop) => shop.id_local !== id_local))
      } else {
        alert(data.message || 'Error al eliminar el local')
      }
    } catch (error) {
      console.error('Error al eliminar el local:', error)
      alert('No se pudo eliminar el local. Revisá la consola.')
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
            Mis locales
          </h2>

          {loading ? (
            <p className="text-gray-500 text-center py-10">Cargando locales...</p>
          ) : shops.length === 0 ? (
            <p className="text-gray-600 text-center py-10">
              No tenés locales registrados todavía. Podés crear uno para empezar a vender.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center w-full">
              {shops.map((shop) => (
                <div
                  key={shop.id_local}
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-md p-4 w-full max-w-md hover:shadow-xl transition duration-300"
                >
                  <ShopCard
                    id={shop.id_local}
                    title={shop.nombre_local}
                    description={shop.descripcion}
                    estrellas={0}
                    etiquetas={shop.etiquetas}
                    banner={shop.banner}
                  />

                  <div className="flex flex-wrap justify-center gap-2 mt-4 w-full">
                    <Link
                      to={`/profile/editshop/${shop.id_local}`}
                      className="flex-1 min-w-[45%] text-center bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm transition"
                    >
                      Editar
                    </Link>

                    <Link
                      to={`/profile/shopproducts/${shop.id_local}`}
                      className="flex-1 min-w-[45%] text-center bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm transition"
                    >
                      Productos
                    </Link>

                    <Link
                      to={`/profile/shopsocials/${shop.id_local}`}
                      className="flex-1 min-w-[45%] text-center bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 text-sm transition"
                    >
                      Redes
                    </Link>

                    <button
                      onClick={() => handleDelete(shop.id_local)}
                      className="flex-1 min-w-[45%] text-center bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
