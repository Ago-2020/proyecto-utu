import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaStar, FaRegStar, FaUser, FaHeart } from "react-icons/fa";
import cardImage from "@/img/card.jpg";
import banner from "@/img/caption.jpg";
import profile_example from "@/img/profilepro.jpg";

export default function Local() {
  const productos = [
    {
      id: 1,
      nombre: "Muffin artesanal",
      descripcion: "Delicioso muffin de vainilla con chips de chocolate.",
      precio: 120,
      imagen: cardImage,
      etiqueta: "Café",
    },
    {
      id: 2,
      nombre: "Tarta de frutilla",
      descripcion: "Base crocante con crema pastelera y frutillas frescas.",
      precio: 180,
      imagen: cardImage,
      etiqueta: "Postre",
    },
    {
      id: 3,
      nombre: "Budín casero",
      descripcion: "Suave, esponjoso y con el toque justo de limón.",
      precio: 150,
      imagen: cardImage,
      etiqueta: "Dulce",
    },
  ];

  const reseñas = [
    {
      id: 1,
      usuario: "Mariana López",
      fecha: "Hace 2 días",
      estrellas: 5,
      comentario: "Excelente atención y comida deliciosa. ¡Volveré pronto!",
      likes: 15,
    },
    {
      id: 2,
      usuario: "Carlos Pérez",
      fecha: "Hace 1 semana",
      estrellas: 4,
      comentario: "Muy rico todo, aunque un poco de demora en el pedido.",
      likes: 9,
    },
    {
      id: 3,
      usuario: "Lucía Fernández",
      fecha: "Hace 3 semanas",
      estrellas: 5,
      comentario: "El ambiente es hermoso, ideal para compartir en familia.",
      likes: 20,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Banner grande con degradado oscuro */}
      <div
        className="relative w-full h-[600px] md:h-[200px] lg:h-[450px] bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        {/* Info del local */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between text-white">
          <div className="flex items-center gap-6">
            <img
              src={profile_example}
              alt="Perfil del local"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h1 className="text-4xl font-bold drop-shadow-lg">El Desafío</h1>
              <p className="text-sm text-gray-200">
                Restaurante familiar — Parrillada & Pastas
              </p>
              <p className="text-sm mt-1 text-gray-200">
                📍 Young, Río Negro, Uruguay
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 text-right">
            <p className="text-gray-200 font-medium">📞 +598 99 123 456</p>
            <p className="text-gray-200 font-medium">@instagramejemploeldesafio.uy</p>
            <p className="bg-red-600 px-4 py-2 mt-2 inline-block rounded-lg font-medium shadow-md">
              Abierto ahora
            </p>
          </div>
        </div>
      </div>

      {/* Tabs centradas */}
      <div className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-center gap-12 py-4 text-gray-600 font-medium">
          <button className="text-red-600 border-b-2 border-red-600 pb-1 transition">
            Reseñas y Publicaciones
          </button>
          <button className="hover:text-red-600 transition">Descripción</button>
        </div>
      </div>

      {/* Contenido */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16">
        {/* Productos del Local */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Productos del Local
          </h2>
          <p className="text-gray-600 mb-10">
            Descubrí nuestros sabores caseros, preparados con amor y dedicación.
          </p>

          {/* Publicaciones tipo tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white border border-gray-200 shadow-lg rounded-2xl w-[380px] h-[460px] flex flex-col overflow-hidden"
              >
                {/* Etiqueta centrada */}
                <div className="p-4 flex justify-center">
                  <span
                    style={{
                      backgroundColor: "#ffe2e2ff",
                      color: "#A83434",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                    }}
                  >
                    {producto.etiqueta}
                  </span>
                </div>

                {/* Imagen reducida y centrada */}
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-[320px] h-[200px] object-cover mx-auto rounded-lg"
                />

                {/* Contenido */}
                <div className="px-6 py-4 flex justify-between items-start flex-1">
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 w-60">
                      {producto.descripcion}
                    </p>
                  </div>
                  <p className="text-red-600 font-bold text-lg">
                    ${producto.precio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reseñas del Local */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-900">
            Reseñas del Local
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            {reseñas.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{r.usuario}</h4>
                    <p className="text-sm text-gray-500">{r.fecha}</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) =>
                        i < r.estrellas ? <FaStar key={i} /> : <FaRegStar key={i} />
                      )}
                    </div>
                    <p className="text-gray-700 mt-2">{r.comentario}</p>
                  </div>
                </div>

                {/* Likes */}
                <div className="flex items-center text-gray-600 gap-2 self-end sm:self-start">
                  <FaHeart className="text-red-500" />
                  <span>{r.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
