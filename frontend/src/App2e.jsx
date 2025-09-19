import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGINAS
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
                                                                                  {/* PAGINAS SIN NAVBAR */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

                                                                                  {/* PAGINAS CON NAVBAR Y FOOTEr */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
