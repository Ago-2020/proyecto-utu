import React, { useEffect, useState } from 'react'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Debes iniciar sesión como administrador')
          setLoading(false)
          return
        }

        const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const res = await fetch(`${BASE}/api/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Error al obtener reportes')

        // Normalizar formato de datos
        setReports(
          data.data.map((r) => ({
            id: r.id_reporte,
            shop_name: r.nombre_local,
            reason: r.razon,
            reporter: r.nombre_usuario,
            date: new Date().toLocaleString(),
          }))
        )
      } catch (err) {
        console.error(err)
        setError('Error al conectar con el servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este reporte?')) return

    try {
      const token = localStorage.getItem('token')
      const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const res = await fetch(`${BASE}/api/admin/reports/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message || 'Reporte eliminado con éxito')
        setReports((prev) => prev.filter((r) => r.id !== id))
      } else {
        alert(data.message || 'Error al eliminar el reporte')
      }
    } catch (err) {
      console.error(err)
      alert('Error al conectar con el servidor')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4 sm:p-6">
      <div className="flex flex-1 justify-center items-start pt-6 sm:pt-10 pb-6 overflow-auto">
        <main className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
            Reportes de locales
          </h2>

          {loading && (
            <p className="text-gray-500 text-center py-10">Cargando reportes...</p>
          )}
          {error && <p className="text-red-600 text-center py-10">{error}</p>}

          {!loading && !error && reports.length === 0 && (
            <p className="text-gray-600 text-center py-10">
              No hay reportes de locales actualmente.
            </p>
          )}

          {!loading && !error && reports.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-600 border">
                <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Local</th>
                    <th className="px-4 py-3">Razón</th>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">{r.id}</td>
                      <td className="px-4 py-3 font-medium">{r.shop_name}</td>
                      <td className="px-4 py-3">{r.reason}</td>
                      <td className="px-4 py-3">{r.reporter}</td>
                      <td className="px-4 py-3">{r.date}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
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
        </main>
      </div>
    </div>
  )
}
