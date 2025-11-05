import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  const location = useLocation()

  // Si estás validando token con API, puedes mostrar loader mientras loading === true
  if (loading) return <div>Comprobando sesión...</div>

  if (!token) {
    // redirige a /login (o /registro). Guardamos la ruta actual en state
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
