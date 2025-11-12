import React, { useEffect, useState } from 'react'
import ShopCard from '@/components/ShopCard'
import { useAuth } from '@/AuthProvider'
import { Link } from 'react-router-dom'

export default function MyShops() {
  const { token } = useAuth()
  const [shops, setShops] = useState([])

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8000/api/shops', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Asegurarse que las etiquetas sean siempre un array
        const normalized = data.map((shop) => ({
          ...shop,
          etiquetas: shop.etiquetas
            ? shop.etiquetas.split(',').map((t) => t.trim())
            : [],
        }))
        setShops(normalized)
      })
      .catch((err) => console.error(err))
  }, [token])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full h-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Mis locales</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          {shops.map((shop) => (
            <div key={shop.id_local} className="flex flex-col items-center">
              <ShopCard
                id={shop.id_local}
                title={shop.nombre_local}
                description={shop.descripcion}
                estrellas={0} // COPILOT COMMENTS MOOOOVEEEEE
                etiquetas={shop.etiquetas}
                banner={shop.banner}
              />

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/profile/editshop/${shop.id_local}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Editar
                </Link>

                <Link
                  to={`/profile/newproduct/${shop.id_local}`}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  + Producto
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
