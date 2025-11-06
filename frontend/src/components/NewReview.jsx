import React, { useState, useRef } from 'react'
import { FaStar, FaTrash } from 'react-icons/fa'

export default function StarRatingReview({
  EstrellasIniciales = 0,
  ComentarioInicial = '',
  onSubmit,
}) {
  const [estrellas, setEstrellas] = useState(EstrellasIniciales)
  const [hover, setHover] = useState(0)
  const [comentario, setComentario] = useState(ComentarioInicial)
  const [mensaje, setMensaje] = useState(null)
  const submitRef = useRef(null)
  const MAX_LENGTH = 500
  const stars = [1, 2, 3, 4, 5]

  function handleSetRating(value) {
    setEstrellas(value)
  }

  function handleKeyOnStar(e, value) {
    if (e.key === 'ArrowLeft') {
      const next = Math.max(1, (hover || estrellas) - 1)
      setHover(next)
      setEstrellas(next)
    } else if (e.key === 'ArrowRight') {
      const next = Math.min(5, (hover || estrellas) + 1)
      setHover(next)
      setEstrellas(next)
    } else if (/^[1-5]$/.test(e.key)) {
      setEstrellas(Number(e.key))
    } else if (e.key === 'Enter') {
      submitRef.current?.click()
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { estrellas, comentario: comentario.trim() }
    if (onSubmit) onSubmit(payload)

    setMensaje('Reseña enviada')
    setEstrellas(0)
    setComentario('')

    setTimeout(() => setMensaje(null), 3000)
  }

  function handleReset() {
    setEstrellas(0)
    setComentario('')
    setMensaje(null)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md"
    >
      {/* Estrellas */}
      <div className="flex items-center gap-4 mb-4">
        <div
          role="radiogroup"
          aria-label="Puntuación"
          className="flex items-center"
        >
          {stars.map((s) => {
            const filled = hover ? s <= hover : s <= estrellas
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleSetRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onKeyDown={(e) => handleKeyOnStar(e, s)}
                aria-checked={estrellas === s}
                aria-label={`${s} estrella${s > 1 ? 's' : ''}`}
                role="radio"
                tabIndex={0}
                className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 hover:scale-110 transition-transform"
              >
                <FaStar
                  size={28}
                  className={`${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              </button>
            )
          })}
        </div>

        <div className="text-sm text-gray-600">
          {estrellas > 0 ? (
            <span className="font-medium">{estrellas} de 5</span>
          ) : (
            <span className="italic">Sin puntuación</span>
          )}
        </div>
      </div>

      {/* Comentario */}
      <label
        htmlFor="review-text"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Escribe tu reseña
      </label>
      <textarea
        id="review-text"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={4}
        maxLength={MAX_LENGTH}
        placeholder="Cuenta tu experiencia..."
        className="w-full text-sm p-3 border rounded-lg resize-y focus:ring-2 focus:ring-red-300 focus:border-red-400 mb-3"
      />

      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-500">
          {comentario.length}/{MAX_LENGTH} caracteres
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-50 flex items-center gap-1"
        >
          <FaTrash className="text-red-500" />
          Limpiar
        </button>

        <button
          ref={submitRef}
          type="submit"
          disabled={estrellas === 0 && comentario.trim().length === 0}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar reseña
        </button>
      </div>

      {/* Mensaje de envío */}
      {mensaje && (
        <div className="mt-4 p-2 text-center bg-green-100 text-green-700 rounded-lg font-medium">
          {mensaje}
        </div>
      )}
    </form>
  )
}
