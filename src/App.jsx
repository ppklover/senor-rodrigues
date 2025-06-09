import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DashboardBarbeiro from "./pages/DashboardBarbeiro";
import Barbeiros from "./pages/Barbeiros";
import Agendamentos from "./pages/Agendamentos";
import Produtos from "./pages/Produtos";
import Estoque from "./pages/Estoque";
import Relatorios from "./pages/Relatorios";
import Servicos from "./pages/Servicos"; // <- NOVO IMPORT

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard-barbeiro" element={<DashboardBarbeiro />} />
        <Route path="/barbeiros" element={<Barbeiros />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/servicos" element={<Servicos />} /> {/* NOVA ROTA */}
      </Routes>
    </Router>
  );
}
