import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

export default function SideBar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.warn('No hay token en localStorage')
        return
      }

      try {
        const res = await fetch('http://localhost:8000/api/users/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()
        if (res.ok) {
          setUser(data.data)
        } else {
          console.error('Error del backend:', data.message)
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error)
      }
    }

    fetchUser()
  }, [])

  return (
    <aside className="w-64 bg-red-600 text-white flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-center py-4 border-b border-red-500">
          Panel de Usuario
        </h2>

        <nav className="flex flex-col p-4 space-y-2">
          {/* Sección general */}
          <span className="font-semibold text-sm mb-1 uppercase opacity-80">
            Perfil de Usuario
          </span>

          <Link to="/profile">
            <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
              Información general
            </button>
          </Link>

          <Link to="/profile/delete">
            <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
              Borrar cuenta
            </button>
          </Link>

          {/* Opciones específicas por tipo de usuario */}
          {user?.tipo_usuario === 'Cliente' && (
            <>
              <span className="font-semibold text-sm mt-4 mb-1 uppercase opacity-80">
                Cliente
              </span>
              <Link to="/profile/favorites">
                <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                  Locales favoritos
                </button>
              </Link>
            </>
          )}

          {(user?.tipo_usuario === 'Emprendedor' ||
            user?.tipo_usuario === 'Administrador') && (
            <>
              <span className="font-semibold text-sm mt-4 mb-1 uppercase opacity-80">
                Administración
              </span>

              <Link to="/profile/myshops">
                <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                  Mis locales
                </button>
              </Link>

              <Link to="/profile/newshop">
                <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                  Registrar local
                </button>
              </Link>

              <Link to="/profile/editshop">
                <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                  Editar local
                </button>
              </Link>

              <Link to="/profile/newpublication">
                <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                  Registrar publicación
                </button>
              </Link>

              <Link to="/profile/comments">
                <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                  Comentarios
                </button>
              </Link>
            </>
          )}

          {user?.tipo_usuario === 'Administrador' && (
            <>
              <span className="font-semibold text-sm mt-4 mb-1 uppercase opacity-80">
                Moderación y Reportes
              </span>

              <Link to="/profile/reportedreviews">
                <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                  Reseñas reportadas
                </button>
              </Link>

              <Link to="/profile/reportedshops">
                <button className="flex items-center gap-2 hover:bg-red-700 p-2 rounded">
                  Locales reportados
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </aside>
  )
}
