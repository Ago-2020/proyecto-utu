import React, { useEffect, useState } from 'react'
import { useAuth } from '@/AuthProvider'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'

export default function ShopProducts() {
  const { token } = useAuth()
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token || !id) return

    setLoading(true)
    fetch(`http://localhost:8000/api/shops/${id}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          setProducts([])
          console.error('Error: la respuesta no es un array')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error al cargar productos:', err)
        setError('No se pudieron cargar los productos')
        setLoading(false)
      })
  }, [token, id])

  const handleDelete = async (id_producto) => {
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return

    try {
      const res = await fetch(
        `http://localhost:8000/api/shops/${id}/products/${id_producto}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        setProducts((prev) => prev.filter((p) => p.id_producto !== id_producto))
      } else {
        alert(data.message || 'Error al eliminar el producto')
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
      alert('No se pudo eliminar el producto.')
    }
  }

  return (
    <div className="flex flex-1 justify-center items-start min-h-screen bg-gray-100 p-4 sm:p-6">
      <main className="bg-white shadow-xl rounded-3xl w-full max-w-7xl p-6 sm:p-10 flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Productos del local
          </h2>
          <Link
            to={`/profile/newproduct/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition text-sm sm:text-base"
          >
            + Producto
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10 w-full">Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10 w-full">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600 text-center py-10 w-full">No hay productos aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-items-center">
            {products.map((product) => (
              <div
                key={product.id_producto}
                className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-md p-4 w-full hover:shadow-xl transition duration-300 max-w-[380px]"
              >
                {/* Contenido de ProductCard ajustado */}
                <div className="flex flex-col bg-white border border-gray-200 shadow-lg rounded-2xl w-full h-auto flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="flex justify-center">
                    <img
                      alt={product.titulo}
                      className="w-full max-w-[320px] sm:max-w-[360px] h-[200px] object-cover rounded-lg mt-4"
                      src={product.foto}
                    />
                  </div>
                  <div className="px-6 py-4 flex justify-between items-start flex-1">
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {product.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 w-full sm:w-auto">
                        {product.descripcion_producto}
                      </p>
                    </div>
                    <p className="text-red-600 font-bold text-lg whitespace-nowrap">
                      ${product.precio}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDelete(product.id_producto)}
                    className="flex-1 text-center bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm"
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
  )
}
