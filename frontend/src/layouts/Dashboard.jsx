import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
