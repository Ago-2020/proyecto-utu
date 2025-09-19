import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '@/layouts/Dashboard'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard />}>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
