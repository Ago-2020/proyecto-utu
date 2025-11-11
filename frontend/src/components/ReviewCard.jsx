import { FaStar, FaRegStar, FaUser, FaHeart, FaTrash } from 'react-icons/fa'
import React, { useState } from 'react'

export default function Review({ review, currentUserId, onDelete, onLike }) {
  const {
    id_resena: id,
    nombre_usuario,
    estrellas,
    comentario,
    likes: initialLikes,
    perfil_url,
    id_usuario: user_id,
  } = review

  const isMine = currentUserId == user_id
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false) // si ya dio like

  const handleLike = () => {
    // //Alternar like localmente
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)

    // Llama al callback para backend
    if (onLike) onLike(id, !liked)
  }

  return (
    <div
      key={id}
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
          {/* Nombre y basura */}
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900 text-lg">
              {nombre_usuario}
            </h4>
            {isMine && (
              <button
                onClick={() => onDelete && onDelete(id)}
                className="text-gray-400 hover:text-red-600"
                title="Borrar reseña"
              >
                <FaTrash className="text-base" />
              </button>
            )}
          </div>

          {/* Estrellas */}
          <div className="flex text-yellow-400 mt-2 text-base">
            {[...Array(5)].map((_, i) =>
              i < estrellas ? (
                <FaStar key={i} className="text-base" />
              ) : (
                <FaRegStar key={i} className="text-base" />
              ),
            )}
          </div>

          {/* Comentario */}
          <p className="text-gray-800 mt-2 text-base text-left">{comentario}</p>
        </div>
      </div>

      {/* Columna derecha: Likes clickeable */}
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
