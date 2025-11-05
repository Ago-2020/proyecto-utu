import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '@/components/Sidebar'
import { useAuth } from '@/AuthProvider'

export default function Profile() {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div>Comprobando sesión...</div>

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <div>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex flex-1">
          <SideBar />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
