import { Link } from "react-router-dom";
import leftImage from "../img/izquierda.png";
import logo from "../img/logo.png";

export default function Register() {
  return (
    <div className="flex min-h-screen">
      
                                                                                    {/* Mitad izquierda con imagen */}
      <div
        className="w-1/2"
        style={{
          backgroundImage: `url(${leftImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

                                                                                    {/* Mitad derecha con logo y formulario */}
      <div
        className="w-1/2 flex items-center justify-center relative"
        style={{ backgroundColor: "#FF3131" }}
      >
                                                                                    {/* Logo que lleva a Home */}
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            style={{
              position: "absolute",
              top: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "120px",
              height: "120px",
              cursor: "pointer",
            }}
          />
        </Link>

                                                                                    {/* Contenedor del formulario */}
        <div
          className="p-8 rounded-lg shadow-lg border"
          style={{
            backgroundColor: "#FFFFFF",
            width: "600px",
            padding: "75px",
            marginTop: "95px",
          }}
        >
          <h2
            className="text-4xl font-bold mb-8 text-center"
            style={{ color: "#000000" }}
          >
            Registro de Usuario
          </h2>

          <form className="space-y-4">
                                                                                    {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#5D5D5D" }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#5D5D5D", color: "#5D5D5D" }}
                required
              />
            </div>

                                                                                    {/* Nombre de usuario */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#5D5D5D" }}
              >
                Nombre de usuario
              </label>
              <input
                type="text"
                placeholder="Tu nombre de usuario"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#5D5D5D", color: "#5D5D5D" }}
                required
              />
            </div>

                                                                                    {/* Contraseña */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#5D5D5D" }}
              >
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Escribe tu contraseña"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#5D5D5D", color: "#5D5D5D" }}
                required
              />
            </div>

                                                                                    {/* Confirmar Contraseña */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#5D5D5D" }}
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="Vuelve a escribir tu contraseña"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#5D5D5D", color: "#5D5D5D" }}
                required
              />
            </div>

                                                                                    {/* Casilla de términos */}
            <div className="flex items-center justify-center mt-4">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded focus:outline-none"
                style={{ accentColor: "#FF3131", borderColor: "#C31313" }}
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 text-sm"
                style={{ color: "#000000" }}
              >
                Acepto los{" "}
                <a
                  href="/terminos"
                  style={{ color: "#FF3131", textDecoration: "underline" }}
                >
                  Términos y Condiciones
                </a>
              </label>
            </div>

                                                                                    {/* Botón de registro */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-bold mt-4"
              style={{ background: "linear-gradient(90deg, #FF3131, #C31313)" }}
            >
              Regístrate ahora
            </button>

                                                                                    {/* Botón de Google */}
            <button
              type="button"
              className="w-full py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2 font-medium mt-2 hover:bg-gray-100 transition"
              style={{ background: "linear-gradient(90deg, #FF3131, #C31313)" }}
            >
              <img
                src="https://www.svgrepo.com/show/380993/google-logo-search-new.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Iniciar con Google
            </button>

                                                                                    {/* Link a login */}
            <div
              className="text-center mt-4 text-sm"
              style={{ color: "#000000" }}
            >
              ¿Ya tenés una cuenta?{" "}
              <Link
                to="/login"
                style={{ color: "#FF3131", textDecoration: "underline" }}
              >
                Iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
