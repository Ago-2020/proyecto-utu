import React from 'react'
import cardImage from '@/img/card.jpg'

export default function ProductCard({
  id,
  nombre,
  descripcion,
  precio,
  tipo_producto,
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-2xl w-[380px] h-[460px] flex flex-col overflow-hidden">
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
          {tipo_producto}
        </span>
      </div>

      {/* Imagen reducida y centrada */}
      <img
        src={cardImage}
        alt={nombre}
        className="w-[320px] h-[200px] object-cover mx-auto rounded-lg"
      />

      {/* Contenido */}
      <div className="px-6 py-4 flex justify-between items-start flex-1">
        <div className="text-left">
          <h3 className="font-semibold text-lg text-gray-900">{nombre}</h3>
          <p className="text-sm text-gray-600 mt-1 w-60">{descripcion}</p>
        </div>
        <p className="text-red-600 font-bold text-lg">${precio}</p>
      </div>
    </div>
  )
}
