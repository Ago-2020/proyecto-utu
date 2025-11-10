import React from 'react'
import { useEffect, useState } from 'react'

export default function ReportedShops({ shops }) {
  const [filteredShops, setFilteredShops] = useState(shops)

  useEffect(() => {
    setFilteredShops(shops)
  }, [shops])

  return (
    <div>
      <h2>Locales Reportados</h2>
      <ul>
        {filteredShops.map((shop) => (
          <li key={shop.id_local}>
            <p>
              <strong>Usuario:</strong> {shop.nombre_usuario}
            </p>
            <p>
              <strong>Local:</strong> {shop.nombre_local}
            </p>
            <p>
              <strong>Comentario:</strong> {shop.comentario}
            </p>
            <p>
              <strong>Estrellas:</strong> {shop.estrellas}
            </p>
            <p>
              <strong>Likes:</strong> {shop.likes}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
