import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Barbeiros from "./pages/Barbeiros";
import Agendamentos from "./pages/Agendamentos";
import Produtos from "./pages/Produtos";
import Estoque from "./pages/Estoque";
import Relatorios from "./pages/Relatorios";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/barbeiros" element={<Barbeiros />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Router>
  );
}