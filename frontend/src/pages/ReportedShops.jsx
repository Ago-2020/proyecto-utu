import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '@/main.css'

export default function ReportedShops() {
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/admin/reports', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        const data = await res.json()

        if (data.success) {
          setReportes(data.data)
        } else {
          throw new Error(data.message || 'Error al obtener reportes')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReportes()
  }, [])

  const handleDelete = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este reporte?')
    if (!confirmar) return

    try {
      const res = await fetch(`http://localhost:8000/api/admin/reports/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message || 'Reporte eliminado con éxito')
        // Actualizamos la lista sin recargar
        setReportes(reportes.filter((r) => r.id_reporte !== id))
      } else {
        alert(data.message || 'Error al eliminar reporte')
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message)
    }
  }

  if (loading) return <p>Cargando reportes...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full h-full max-w-6xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Locales Reportados</h2>
          {reportes.length === 0 ? (
            <p>No hay reportes registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID Reporte</th>
                    <th>Local</th>
                    <th>Razón</th>
                    <th>Usuario</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((r) => (
                    <tr key={r.id_reporte}>
                      <td>{r.id_reporte}</td>
                      <td>{r.nombre_local}</td>
                      <td>{r.razon}</td>
                      <td>{r.nombre_usuario || `Usuario #${r.id_usuario}`}</td>
                      <td className="text-center">
                        <Link
                          to={`/local/${r.id_local}`}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
                        >
                          Ver Local
                        </Link>
                        <button
                          onClick={() => handleDelete(r.id_reporte)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
