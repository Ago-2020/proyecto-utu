import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '@/components/Sidebar'

export default function Profile() {
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
