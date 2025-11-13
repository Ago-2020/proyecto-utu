import {
  FaStar,
  FaRegStar,
  FaUser,
  FaHeart,
  FaTrash,
  FaFlag,
} from 'react-icons/fa'
import React, { useState } from 'react'

export default function Review({ review, currentUserId, onDelete, onLike }) {
  const {
    id_resena: id_resena,
    nombre_usuario,
    estrellas,
    comentario,
    likes: initialLikes,
    perfil_url,
    id_usuario: user_id,
    id_local,
  } = review

  const isMine = currentUserId == user_id
  const [liked, setLiked] = useState(Boolean(Number(review.liked)))
  const [likes, setLikes] = useState(Number(initialLikes) || 0)

  const handleLike = () => {
    setLiked(!liked)
    setLikes((prev) => (liked ? prev - 1 : prev + 1))
    if (onLike) onLike(id_resena, !liked)
  }

  const handleReport = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/shops/${id_local}/review/${id_resena}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      const data = await res.json()

      if (data.success) {
        alert('Reseña reportada con éxito')
      } else {
        alert(data.message || 'No se pudo reportar la reseña')
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message)
    }
  }

  return (
    <div
      key={id_resena}
      className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 shadow-sm"
    >
      {/* Columna izquierda */}
      <div className="flex items-start gap-4 flex-1">
        {/* Perfil */}
        <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center bg-gray-200 overflow-hidden">
          {perfil_url ? (
            <img
              src={perfil_url}
              alt={nombre_usuario}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-gray-500 text-2xl" />
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900 text-lg">
              {nombre_usuario}
            </h4>
            <div className="flex gap-3 items-center">
              {/* Botón de reportar */}
              {!isMine && (
                <button
                  onClick={handleReport}
                  className="text-gray-400 hover:text-yellow-600"
                  title="Reportar reseña"
                >
                  <FaFlag className="text-base" />
                </button>
              )}

              {/* Botón de borrar si es tuya */}
              {isMine && (
                <button
                  onClick={() => onDelete && onDelete(id_resena)}
                  className="text-gray-400 hover:text-red-600"
                  title="Borrar reseña"
                >
                  <FaTrash className="text-base" />
                </button>
              )}
            </div>
          </div>

          <div className="flex text-yellow-400 mt-2 text-base">
            {[...Array(5)].map((_, i) =>
              i < estrellas ? (
                <FaStar key={i} className="text-base" />
              ) : (
                <FaRegStar key={i} className="text-base" />
              ),
            )}
          </div>

          <p className="text-gray-800 mt-2 text-base text-left">{comentario}</p>
        </div>
      </div>

      {/* Likes */}
      <div className="flex flex-col items-end gap-2 mt-2 sm:mt-0">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-base transition-colors ${liked ? 'text-red-600' : 'text-gray-600'}`}
        >
          <FaHeart className="text-base" />
          <span className="text-sm">{likes}</span>
        </button>
      </div>
    </div>
  )
}
