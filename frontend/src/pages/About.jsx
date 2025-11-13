import Tag from '@/components/Tag'
import React from 'react'
import { FaUser } from 'react-icons/fa'

export default function About() {
  const team = [
    {
      name: 'Ezequiel',
      role: 'Desarrollor Front-End',
      img: '/img/Ezequiel.jpg',
    },
    {
      name: 'Santiago',
      role: 'Desarrollor Back-End',
      img: '/img/Santiago.jpg',
    },
    { name: 'Ayrton', role: 'Desarrollador SQL', img: '/img/Ayrton.jpg' },
    { name: 'Johnatan', role: 'Gestor del proyecto', img: '/img/Johnatan.jpg' },
    {
      name: 'Sirio',
      role: 'Testing y Control de Calidad (QA)',
      img: '/img/Sirio.jpg',
    },
  ]

  const checkImage = (path) => {
    try {
      const img = new Image()
      img.src = path
      return img.complete && img.naturalWidth !== 0
    } catch {
      return false
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center px-4 py-20 text-center">
        <Tag>Historia</Tag>
        <h1 className="text-3xl font-bold mb-6">Sobre Nosotros</h1>
        <p className="text-gray-600 max-w-2xl mb-12">
          Somos una plataforma dedicada a ayudar a los negocios locales a ganar
          visibilidad y conectar con su comunidad de manera sencilla y efectiva.
        </p>

        {/* Bloque 1 - 3 en fila */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 mt-8">
          {team.slice(0, 3).map((member) => (
            <div
              key={member.name}
              className="bg-white border border-gray-200 shadow-lg rounded-2xl p-4 w-56 text-center hover:shadow-2xl transition-all duration-300"
            >
              {checkImage(member.img) ? (
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto border-4 border-gray-300 shadow-sm">
                  <FaUser className="text-gray-400 text-4xl" />
                </div>
              )}
              <h2 className="text-lg font-semibold mt-3">{member.name}</h2>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Bloque 2 - 2 en fila centrados */}
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {team.slice(3, 5).map((member) => (
            <div
              key={member.name}
              className="bg-white border border-gray-200 shadow-lg rounded-2xl p-4 w-56 text-center hover:shadow-2xl transition-all duration-300"
            >
              {checkImage(member.img) ? (
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto border-4 border-gray-300 shadow-sm">
                  <FaUser className="text-gray-400 text-4xl" />
                </div>
              )}
              <h2 className="text-lg font-semibold mt-3">{member.name}</h2>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
