import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const formRef = useRef();
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);

    emailjs
      .sendForm(
        "service_ID", // Service ID
        "template_ID", // Template ID
        formRef.current,
        "public_KEY" // Public Key
      )
      .then(
        () => {
          setEnviando(false);
          setEnviado(true);
          formRef.current.reset();
          setTimeout(() => setEnviado(false), 4000);
        },
        (error) => {
          console.error("Error:", error);
          setEnviando(false);
          alert("Hubo un error al enviar el mensaje. Intentá de nuevo.");
        }
      );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow px-6 sm:px-12 md:px-24 py-25">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-red-600 mb-10">
          Contáctanos
        </h1>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Información */}
          <div className="flex flex-col justify-center space-y-5 text-gray-700">
            <h2 className="text-2xl font-semibold">¿Tenés alguna duda?</h2>
            <p className="text-gray-600">
              En <strong>SaborUY</strong> valoramos tu opinión. Si querés más
              información, colaborar con nosotros o reportar un problema,
              escribinos a través del formulario o por correo electrónico.
            </p>
            <div className="space-y-2 text-sm">
              <p>
                 <strong>Ubicación:</strong> Rio Negro, Uruguay
              </p>
              <p>
                 <strong>Email:</strong>{" "}
                <a
                  href="mailto:contacto@saboruy.com"
                  className="text-red-600 hover:underline"
                >
                  contacto@saboruy.com
                </a>
              </p>
              <p>
                 <strong>Teléfono:</strong> +598 1234 5678
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 text-gray-700"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="user_name"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="user_email"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mensaje</label>
              <textarea
                name="message"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Escribí tu mensaje aquí..."
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className={`${
                enviando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } text-white font-semibold py-2.5 rounded-lg transition-all duration-200`}
            >
              {enviando ? "Enviando..." : "Enviar mensaje"}
            </button>

            {enviado && (
              <p className="text-green-600 font-medium mt-2 text-center">
              ¡Gracias por contactarnos! Te responderemos pronto.
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
