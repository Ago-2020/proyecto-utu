import React, { useEffect, useState } from 'react'
import ShopCard from '@/components/ShopCard'
import { useAuth } from '@/AuthProvider'

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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        flexWrap: 'wrap',
      }}
    >
      {shops.map((shop) => (
        <ShopCard
          key={shop.id_local}
          id={shop.id_local}
          title={shop.nombre_local}
          description={shop.descripcion}
          estrellas={0} // Aquí puedes agregar estrellas si tienes esa info
          etiquetas={shop.etiquetas}
        />
      ))}
    </div>
  )
}
