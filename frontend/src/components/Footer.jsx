import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo.png'

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '32px 16px',
        textAlign: 'center',
      }}
    >
      {/* Logo arriba redondeado */}
      <img
        src={logo}
        alt="logo"
        style={{
          width: '40px',
          height: '40px',
          margin: '0 auto 24px',
          display: 'block',
          borderRadius: '50%',
        }}
      />

      {/* Links */}
      <ul
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          listStyle: 'none',
          marginBottom: '16px',
          padding: 0,
          fontSize: '14px',
        }}
      >
        <li>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>
            Sobre Nosotros
          </Link>
        </li>
        <li>
          <Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>
            Contacto
          </Link>
        </li>
        <li>
          <Link to="/terms" style={{ color: '#fff', textDecoration: 'none' }}>
            Términos de Servicio
          </Link>
        </li>
      </ul>

      {/* Copyright */}
      <p style={{ fontSize: '12px', color: '#aaa' }}>
        Copyright © 2025. All Rights Reserved.
      </p>
    </footer>
  )
}
