import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
export default function NewPublication() {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    foto: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, foto: file });

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.precio <= 0) {
      return alert("El precio debe ser mayor que 0");
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Debe iniciar sesión para registrar una publicación.");

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      const res = await fetch("http://localhost:8000/api/publications/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Publicación registrada correctamente 🎉");
        window.location.href = "/profile/myshops";
      } else {
        alert(data.message || "Error al registrar la publicación");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 ml-[120px] p-6">
      <main className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-6xl flex flex-col md:flex-row gap-10">
        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 grid grid-cols-1 gap-6"
          encType="multipart/form-data"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ingrese el título"
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ingrese la descripción"
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Precio</label>
            <input
              type="number"
              name="precio"
              min="1"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ingrese precio mayor que 0"
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-16 py-4 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              Guardar Publicación
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-center">Preview de la Publicación</h2>
          <ProductCard
            titulo={form.titulo}
            descripcion={form.descripcion}
            precio={form.precio > 0 ? form.precio : ""}
            foto={preview}
          />
        </div>
      </main>
    </div>
  );
}
