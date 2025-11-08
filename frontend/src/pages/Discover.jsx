import { useEffect, useState } from 'react'
import ShopCard from '@/components/ShopCard'
import { useLocation } from 'react-router-dom'

export default function Discover() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const query = params.get('q') || ''
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) return

    fetch(
      `http://localhost:8000/api/shops/search?q=${encodeURIComponent(query)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('Respuesta del backend:', data) // 👈 loguea pero no rompe la cadena
        if (data.success) setResults(data.data)
      })
      .catch((err) => console.error('Error en fetch:', err))
  }, [query])
  return (
    <div>
      <h1>Descubrir</h1>
      {/* Aquí puedes agregar el contenido de la página "Descubrir" */}
      <div>
        {results.length === 0 ? (
          <p>No se encontraron locales con el nombre "{query}".</p>
        ) : (
          results.map((local) => (
            <ShopCard
              key={local.id_local}
              id={local.id_local}
              title={local.nombre_local}
              description={`${local.ubicacion ?? ''} ${local.numero ?? ''}`}
              estrellas={local.estrellas_promedio ?? 0}
            />
          ))
        )}
      </div>
    </div>
  )
}
