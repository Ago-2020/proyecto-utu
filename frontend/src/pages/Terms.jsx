import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <main className="flex-grow px-6 sm:px-12 md:px-24 py-16 text-gray-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-red-600 mb-10">
          Términos y Condiciones de Uso
        </h1>

        <section className="max-w-4xl mx-auto text-justify space-y-6 bg-white p-8 rounded-2xl shadow-lg">
          <p>
            Bienvenido/a a <strong>SaborUY</strong>, una plataforma diseñada para
            promover y conectar emprendimientos gastronómicos locales con
            clientes interesados en descubrir nuevos sabores y experiencias.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-6">1. Aceptación de los términos</h2>
          <p>
            Al acceder o utilizar nuestro sitio web, usted acepta cumplir con
            estos términos y condiciones. Si no está de acuerdo con alguna parte
            de los mismos, le recomendamos no utilizar el servicio.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-6">2. Uso de la plataforma</h2>
          <p>
            Los usuarios pueden crear perfiles, publicar productos y compartir
            información sobre sus locales gastronómicos. Está prohibido publicar
            contenido falso, ofensivo o que infrinja derechos de terceros.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-6">3. Responsabilidad del usuario</h2>
          <p>
            Cada usuario es responsable del contenido que publica.{" "}
            <strong>SaborUY</strong> no se hace responsable por información
            incorrecta, precios falsos o reclamos derivados de las transacciones
            entre usuarios.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-6">4. Propiedad intelectual</h2>
          <p>
            Todo el contenido visual, logotipos y diseño pertenecen a{" "}
            <strong>SaborUY</strong>. Queda prohibido el uso no autorizado de
            cualquier material presente en la plataforma.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-6">5. Privacidad de los datos</h2>
          <p>
            Nos comprometemos a proteger la información personal de nuestros
            usuarios. Los datos se utilizan únicamente con fines operativos y
            nunca se compartirán con terceros sin consentimiento.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-6">6. Modificaciones</h2>
          <p>
            <strong>SaborUY</strong> se reserva el derecho de actualizar estos
            términos en cualquier momento. Las modificaciones entrarán en vigor
            una vez publicadas en el sitio web.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-6">7. Contacto</h2>
          <p>
            Si tiene dudas sobre estos términos o el funcionamiento del sitio,
            puede contactarnos a través del formulario disponible en la sección{" "}
            <strong>Contacto</strong> o enviando un correo a{" "}
            <a
              href="mailto:contacto@saboruy.com"
              className="text-red-600 hover:underline"
            >
              contacto@saboruy.com
            </a>
            .
          </p>

          <p className="text-sm text-gray-500 mt-10 text-center">
            Última actualización: Noviembre 2025
          </p>
        </section>
      </main>

    </div>
  );
}
