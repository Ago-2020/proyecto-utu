import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCamera } from 'react-icons/fa'
import DefaultAvatar from '@/img/profile.png'
import SideBar from '../components/SideBar'
import { Edit3 } from 'lucide-react'

export default function PerfilUsuario() {
  const [user, setUser] = useState(null)
  const [passwordAntigua, setPasswordAntigua] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const scaleFactor = 0.9

  const [editingField, setEditingField] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('http://localhost:8000/api/users/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()
        if (res.ok) setUser(data.data)
      } catch (err) {
        console.error('Error al obtener usuario:', err)
      }
    }
    fetchUser()
  }, [])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!passwordAntigua || !passwordNueva) {
      setError('Ambas contraseñas son requeridas.')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setError('No estás autenticado.')
      return
    }

    try {
      const res = await fetch('http://localhost:8000/api/users/passchange', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password_antigua: passwordAntigua.trim(),
          password_nueva: passwordNueva.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setError('')
        alert('Contraseña cambiada con éxito.')
        setPasswordAntigua('')
        setPasswordNueva('')
      } else {
        setError(data.message || 'Error al cambiar la contraseña.')
      }
    } catch (err) {
      console.error(err)
      setError('Hubo un error al intentar cambiar la contraseña.')
    }
  }

  // Cambio de foto de perfil

  const handleProfileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      uploadProfilePicture(file)
    }
  }

  const uploadProfilePicture = async (file) => {
    const token = localStorage.getItem('token')
    if (!token || !user) return

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('nombre_usuario', user.nombre_usuario)
    formData.append('email_usuario', user.email_usuario)
    formData.append('imagen', file)

    try {
      const res = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        alert('Perfil actualizado correctamente.')
        setUser((prev) => ({ ...prev, foto: URL.createObjectURL(file) }))
      } else alert(data.message || 'Error al actualizar el perfil.')
    } catch (err) {
      console.error(err)
      alert('Error al subir la foto.')
    }
  }

  // Cambio de nombre de usuario

  const handleEdit = (field) => setEditingField(field)

  const handleFieldChange = (e) => {
    setUser({ ...user, [editingField]: e.target.value })
  }

  const handleFieldBlur = async () => {
    if (!editingField) return
    await updateUser({})
    setEditingField(null)
  }

  const handleFieldKeyDown = (e) => {
    if (e.key === 'Enter') handleFieldBlur()
  }

  const updateUser = async (extraData = {}) => {
    const token = localStorage.getItem('token')
    if (!token || !user) return

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('nombre_usuario', user.nombre_usuario)
    formData.append('email_usuario', user.email_usuario)

    if (extraData.imagen) formData.append('imagen', extraData.imagen)

    try {
      const res = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (extraData.imagen) {
          setUser((prev) => ({
            ...prev,
            foto: URL.createObjectURL(extraData.imagen),
          }))
        }
      } else {
        alert(data.message || 'Error al actualizar el perfil.')
      }
    } catch (err) {
      console.error(err)
      alert('Error al actualizar el perfil.')
    }
  }

  if (!user) return null

  return (
    <div className="flex flex-1 h-screen bg-gray-100">
      <div className="flex flex-1 justify-center items-start p-4 overflow-auto pt-6">
        <main
          className="bg-white shadow-xl rounded-3xl flex flex-col items-center"
          style={{
            padding: `${4 * scaleFactor}rem`,
            width: `${100 * scaleFactor}%`,
            maxWidth: `${820 * scaleFactor}px`,
          }}
        >
          <h1
            className="font-semibold text-center mb-6"
            style={{ fontSize: `${20 * scaleFactor}px` }}
          >
            Cuenta de{' '}
            <span className="text-red-600">
              {user?.tipo_usuario || 'Usuario'}
            </span>
          </h1>

          {/* FOTO Y DATOS */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="relative group rounded-full border-4 border-red-600 overflow-hidden"
              style={{
                width: `${100 * scaleFactor}px`,
                height: `${100 * scaleFactor}px`,
                marginBottom: `${12 * scaleFactor}px`,
                cursor: 'pointer',
              }}
              onClick={handleProfileClick}
            >
              {/* Imagen del usuario */}
              <img
                src={user?.foto || DefaultAvatar}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay con ícono FaCamera */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                <FaCamera className="text-white text-2xl mb-1" />
                <span className="text-white text-sm font-medium text-center">
                  Cambiar foto
                </span>
              </div>

              {/* Input oculto para archivo */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* --- CAMPOS EDITABLES --- */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {/* Nombre */}
              <div className="flex items-center gap-2">
                <Edit3
                  className="text-red-600 cursor-pointer hover:text-red-800 transition"
                  size={18}
                  onClick={() => handleEdit('nombre_usuario')}
                />
                {editingField === 'nombre_usuario' ? (
                  <input
                    type="text"
                    value={user.nombre_usuario}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    onKeyDown={handleFieldKeyDown}
                    autoFocus
                    className="border-b border-gray-400 outline-none flex-1 text-gray-700"
                  />
                ) : (
                  <h2
                    style={{
                      fontSize: `${16 * scaleFactor}px`,
                      fontWeight: 500,
                    }}
                    className="flex-1"
                  >
                    {user.nombre_usuario}
                  </h2>
                )}
              </div>
            </div>
            <p style={{ fontSize: `${14 * scaleFactor}px`, color: '#4B5563' }}>
              {user?.email_usuario || 'Sin Email'}
            </p>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row justify-center mb-6 gap-4">
            <button
              onClick={() => navigate('/profile/newshop')}
              style={{
                padding: `${6 * scaleFactor}px ${24 * scaleFactor}px`,
                fontSize: `${14 * scaleFactor}px`,
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition hover:scale-105"
            >
              Crear Local
            </button>
            <button
              onClick={() => navigate('/profile/delete')}
              style={{
                padding: `${6 * scaleFactor}px ${24 * scaleFactor}px`,
                fontSize: `${14 * scaleFactor}px`,
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition hover:scale-105"
            >
              Borrar cuenta
            </button>
          </div>

          {/* CAMBIO DE CONTRASEÑA */}
          <div className="w-full max-w-md flex flex-col items-center">
            <h3
              className="font-semibold mb-3 text-center"
              style={{ fontSize: `${18 * scaleFactor}px` }}
            >
              Cambiar Contraseña
            </h3>
            {error && (
              <p
                className="text-red-500 text-center mb-2"
                style={{ fontSize: `${14 * scaleFactor}px` }}
              >
                {error}
              </p>
            )}
            <form
              className="grid grid-cols-1 gap-4 w-full"
              onSubmit={handleChangePassword}
            >
              {[
                {
                  label: 'Contraseña Antigua',
                  value: passwordAntigua,
                  setValue: setPasswordAntigua,
                },
                {
                  label: 'Contraseña Nueva',
                  value: passwordNueva,
                  setValue: setPasswordNueva,
                },
              ].map((field, i) => (
                <div key={i} className="flex flex-col w-full">
                  <label
                    className="font-medium text-gray-700 mb-1"
                    style={{ fontSize: `${14 * scaleFactor}px` }}
                  >
                    {field.label}
                  </label>
                  <input
                    type="password"
                    placeholder={`Introduce la ${field.label.toLowerCase()}`}
                    style={{
                      padding: `${8 * scaleFactor}px`,
                      fontSize: `${14 * scaleFactor}px`,
                    }}
                    className="border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
                    value={field.value}
                    onChange={(e) => field.setValue(e.target.value)}
                  />
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  style={{
                    padding: `${8 * scaleFactor}px ${24 * scaleFactor}px`,
                    fontSize: `${14 * scaleFactor}px`,
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition hover:scale-105"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
