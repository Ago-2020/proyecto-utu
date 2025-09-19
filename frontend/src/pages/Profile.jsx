import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar />
    
          <main style={{ flexGrow: 1, padding: "64px 16px", textAlign: "center" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px" }}>
              Perfil
            </h1>
            <p style={{ color: "#555", maxWidth: "800px", margin: "0 auto" }}>
              Somos una plataforma dedicada a ayudar a los negocios locales a ganar visibilidad y
              conectar con su comunidad de manera sencilla y efectiva.
            </p>
          </main>
    
          <Footer />
        </div>
  );
}
