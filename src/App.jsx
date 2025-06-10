
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Barbeiros from "./pages/Barbeiros";
import Produtos from "./pages/Produtos";
import Estoque from "./pages/Estoque";
import Servicos from "./pages/Servicos";
import Clientes from "./pages/Clientes"; // NOVO

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/barbeiros" element={<Barbeiros />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  );
}
