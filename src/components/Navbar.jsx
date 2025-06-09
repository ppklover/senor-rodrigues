import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">SEÑOR RODRIGUES</h1>
      <div className="space-x-4">
        <Link to="/">Dashboard</Link>
        <Link to="/barbeiros">Barbeiros</Link>
        <Link to="/agendamentos">Agendamentos</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/estoque">Estoque</Link>
        <Link to="/relatorios">Relatórios</Link>
      </div>
    </nav>
  );
}