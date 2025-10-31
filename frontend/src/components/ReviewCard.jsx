import { FaStar, FaRegStar, FaUser, FaHeart } from 'react-icons/fa'
import React from 'react'

export default function Review({ review }) {
  const { nombre_usuario, fecha, estrellas, comentario, likes } = review

  return (
    <div
      key={review.id}
      className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <FaUser className="text-gray-600" />
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-gray-900">{nombre_usuario}</h4>
          <p className="text-sm text-gray-500">{fecha}</p>
          <div className="flex text-yellow-500 mt-1">
            {[...Array(5)].map((_, i) =>
              i < estrellas ? <FaStar key={i} /> : <FaRegStar key={i} />,
            )}
          </div>
          <p className="text-gray-700 mt-2">{comentario}</p>
        </div>
      </div>

      {/* Likes */}
      <div className="flex items-center text-gray-600 gap-2 self-end sm:self-start">
        <FaHeart className="text-red-500" />
        <span>{likes}</span>
      </div>
    </div>
  )
}
