import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoblack from "../img/logoblack.png";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-black text-white py-8 px-4 text-center flex flex-col items-center"
    >
      {/* Logo */}
      <img
        src={logoblack}
        alt="logoblack"
        className="w-12 h-12 mb-6 rounded-full object-cover"
      />

      {/* Links */}
      <ul className="flex flex-col sm:flex-row sm:gap-8 gap-4 justify-center items-center mb-4 text-sm">
        <li>
          <Link
            to="/"
            className="hover:text-red-500 transition-colors duration-200"
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="hover:text-red-500 transition-colors duration-200"
          >
            Sobre Nosotros
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="hover:text-red-500 transition-colors duration-200"
          >
            Contacto
          </Link>
        </li>
        <li>
          <Link
            to="/terms"
            className="hover:text-red-500 transition-colors duration-200"
          >
            Términos de Servicio
          </Link>
        </li>
      </ul>

      {/* Línea divisoria */}
      <div className="w-3/4 border-t border-gray-700 my-2"></div>

      {/* Copyright */}
      <p className="text-xs text-gray-400 mt-2">
        © 2025 SaborUY. Todos los derechos reservados.
      </p>
    </motion.footer>
  );
}
