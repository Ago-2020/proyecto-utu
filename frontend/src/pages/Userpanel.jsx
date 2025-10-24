import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import React from 'react'

export default function About() {
  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <main style={{ flexGrow: 1, padding: '64px 16px', textAlign: 'center' }}>
        <h1
          style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}
        >
          Panel
        </h1>
        <p style={{ color: '#555', maxWidth: '800px', margin: '0 auto' }}>
          Panel del usuario
        </p>
      </main>
    </div>
  )
}
