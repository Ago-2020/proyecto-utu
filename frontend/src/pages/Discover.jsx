import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopCard from '@/components/ShopCard'

export default function DiscoverPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const query = params.get('q') || ''
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) return

    fetch(
      `http://localhost:8000/api/shops/search?q=${encodeURIComponent(query)}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('Respuesta del backend:', data)
        if (data.success) setResults(data.data)
      })
      .catch((err) => console.error('Error en fetch:', err))
  }, [query])

  return (
    <div className="page-container">

      <main className="content">
        <div className="discover-container">
          <h1 className="discover-title">
            {query ? `Resultados para "${query}"` : 'Descubrir'}
          </h1>

          <div className="results-grid">
            {results.length === 0 ? (
              <p className="no-results">
                No se encontraron locales con el nombre "{query}".
              </p>
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
      </main>

      <Footer />

      <style>{`
        /* Layout principal */
        .page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh; /* altura completa de la ventana */
        }

        .content {
          flex: 1; /* ocupa el espacio restante entre Navbar y Footer */
        }

        /* Discover */
        .discover-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .discover-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #dc2626; /* rojo similar al navbar */
          text-align: center;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .no-results {
          grid-column: 1/-1;
          text-align: center;
          font-size: 1.2rem;
          color: #555;
          padding: 40px 0;
        }

        @media (max-width: 768px) {
          .discover-title {
            font-size: 1.5rem;
          }

          .results-grid {
            gap: 15px;
          }
        }

        @media (max-width: 480px) {
          .discover-container {
            padding: 15px;
          }

          .discover-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  )
}
