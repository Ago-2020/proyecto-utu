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

  const handleDeleteReport = async (id) => {
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
        setReportes((prev) => prev.filter((r) => r.id_reporte !== id))
      } else {
        alert(data.message || 'Error al eliminar reporte')
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message)
    }
  }

  const handleDeleteLocal = async (id_local) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este local definitivamente?')
    if (!confirmar) return

    try {
      const res = await fetch(`http://localhost:8000/api/admin/shops/${id_local}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message || 'Local eliminado con éxito')
        // Opcional: también eliminar los reportes de ese local de la vista
        setReportes((prev) => prev.filter((r) => r.id_local !== id_local))
      } else {
        alert(data.message || 'Error al eliminar local')
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message)
    }
  }

  if (loading) return <p className="p-6 text-gray-700">Cargando reportes...</p>
  if (error) return <p className="text-red-500 p-6">Error: {error}</p>

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <main className="bg-white shadow-lg rounded-2xl p-6 md:p-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-red-600">
          Locales Reportados
        </h2>

        {reportes.length === 0 ? (
          <p className="text-gray-600">No hay reportes registrados.</p>
        ) : (
          <>
            {/* Tabla para pantallas grandes */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">ID</th>
                    <th className="p-3">Local</th>
                    <th className="p-3">Razón</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((r) => (
                    <tr key={r.id_reporte} className="hover:bg-gray-50">
                      <td className="p-3">{r.id_reporte}</td>
                      <td className="p-3">{r.nombre_local}</td>
                      <td className="p-3">{r.razon}</td>
                      <td className="p-3">{r.nombre_usuario || `Usuario #${r.id_usuario}`}</td>
                      <td className="p-3 text-center space-x-2">
                        <Link
                          to={`/local/${r.id_local}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Ver Local
                        </Link>
                        <button
                          onClick={() => handleDeleteReport(r.id_reporte)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Eliminar Reporte
                        </button>
                        <button
                          onClick={() => handleDeleteLocal(r.id_local)}
                          className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Borrar Local
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista móvil en tarjetas */}
            <div className="md:hidden flex flex-col gap-4">
              {reportes.map((r) => (
                <div
                  key={r.id_reporte}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Local:</span> {r.nombre_local}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Razón:</span> {r.razon}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Usuario:</span> {r.nombre_usuario || `#${r.id_usuario}`}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Link
                      to={`/local/${r.id_local}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg text-center"
                    >
                      Ver Local
                    </Link>
                    <button
                      onClick={() => handleDeleteReport(r.id_reporte)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg"
                    >
                      Eliminar Reporte
                    </button>
                    <button
                      onClick={() => handleDeleteLocal(r.id_local)}
                      className="bg-red-800 hover:bg-red-900 text-white text-sm px-3 py-2 rounded-lg"
                    >
                      Borrar Local
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
