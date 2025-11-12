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
        console.log('Productos recibidos:', data)
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
        },
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

  if (loading) return <p className="ml-[120px] p-6">Cargando productos...</p>
  if (error) return <p className="ml-[120px] p-6 text-red-600">{error}</p>
  if (products.length === 0)
    return (
      <div className="ml-[120px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Productos del local</h2>
          <Link
            to={`/profile/newproduct/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Producto
          </Link>
        </div>
        <p>No hay productos aún.</p>
      </div>
    )

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full h-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Productos del local</h2>
          <Link
            to={`/profile/newproduct/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Producto
          </Link>
        </div>

        <div className="flex justify-center gap-8 flex-wrap">
          {products.map((product) => (
            <div
              key={product.id_producto}
              className="flex flex-col items-center"
            >
              <ProductCard
                titulo={product.titulo}
                descripcion={product.descripcion_producto}
                precio={product.precio}
                foto={product.foto}
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDelete(product.id_producto)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
