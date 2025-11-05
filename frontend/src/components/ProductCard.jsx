import React from "react";

export default function ProductCard({ titulo, descripcion, precio, foto }) {
  const imageSrc = foto
    ? foto.startsWith("data:")
      ? foto // imagen del FileRead
      : `http://localhost:8000/uploads/${foto}` // imagen del backend
    : "/default-product.jpg";

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-2xl w-[360px] sm:w-[380px] h-auto flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Imagen */}
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt={titulo}
          className="w-[320px] h-[200px] object-cover rounded-lg mt-4"
        />
      </div>

      {/* Contenido */}
      <div className="px-6 py-4 flex justify-between items-start flex-1">
        <div className="text-left">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {titulo}
          </h3>
          {descripcion && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 w-56 sm:w-60">
              {descripcion}
            </p>
          )}
        </div>
        {precio > 0 && (
          <p className="text-red-600 font-bold text-lg whitespace-nowrap">
            ${precio}
          </p>
        )}
      </div>
    </div>
  );
}
