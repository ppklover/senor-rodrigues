import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroBarbeiro, setFiltroBarbeiro] = useState('');

  useEffect(() => {
    const fetchServicos = async () => {
      const querySnapshot = await getDocs(collection(db, 'servicos'));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setServicos(data);
    };

    const fetchProdutos = async () => {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setProdutos(data);
    };

    const fetchUsuarios = async () => {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.id);
      });
      setUsuarios(data);
    };

    fetchServicos();
    fetchProdutos();
    fetchUsuarios();
  }, []);

  const servicosFiltrados = servicos.filter((s) => {
    const dataOk = filtroData ? s.data.toDate().toISOString().split('T')[0] === filtroData : true;
    const tipoOk = filtroTipo ? s.tipoServico === filtroTipo : true;
    const barbeiroOk = filtroBarbeiro ? s.barbeiroId === filtroBarbeiro : true;
    return dataOk && tipoOk && barbeiroOk;
  });

  const produtosFiltrados = produtos.filter((p) => {
    const dataOk = filtroData ? p.data.toDate().toISOString().split('T')[0] === filtroData : true;
    const barbeiroOk = filtroBarbeiro ? p.barbeiroId === filtroBarbeiro : true;
    return dataOk && barbeiroOk;
  });

  const totalBrutoServicos = servicosFiltrados.reduce((acc, curr) => acc + curr.valorServico, 0);
  const totalLiquidoServicos = totalBrutoServicos * 0.6;

  const totalBrutoProdutos = produtosFiltrados.reduce((acc, curr) => acc + curr.valorProduto, 0);
  const totalLiquidoProdutos = totalBrutoProdutos * 0.6;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard do ADMIN</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div>
          <label>Data:</label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="border p-2 rounded ml-2"
          />
        </div>
        <div>
          <label>Tipo:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border p-2 rounded ml-2"
          >
            <option value="">Todos</option>
            <option value="Corte">Corte</option>
            <option value="Barba">Barba</option>
            <option value="Sobrancelha">Sobrancelha</option>
          </select>
        </div>
        <div>
          <label>Barbeiro:</label>
          <select
            value={filtroBarbeiro}
            onChange={(e) => setFiltroBarbeiro(e.target.value)}
            className="border p-2 rounded ml-2"
          >
            <option value="">Todos</option>
            {usuarios.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 space-y-1">
        <p className="text-lg">Serviços Bruto: <span className="text-blue-600">R$ {totalBrutoServicos.toFixed(2)}</span></p>
        <p className="text-lg">Serviços Líquido: <span className="text-green-600">R$ {totalLiquidoServicos.toFixed(2)}</span></p>
        <p className="text-lg">Produtos Bruto: <span className="text-blue-600">R$ {totalBrutoProdutos.toFixed(2)}</span></p>
        <p className="text-lg">Produtos Líquido: <span className="text-green-600">R$ {totalLiquidoProdutos.toFixed(2)}</span></p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Serviços Registrados</h3>
        <table className="w-full table-auto border mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Valor</th>
              <th className="border px-2 py-1">Data</th>
              <th className="border px-2 py-1">Barbeiro</th>
            </tr>
          </thead>
          <tbody>
            {servicosFiltrados.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-1">{s.tipoServico}</td>
                <td className="border px-2 py-1">R$ {s.valorServico.toFixed(2)}</td>
                <td className="border px-2 py-1">{s.data.toDate().toLocaleDateString()}</td>
                <td className="border px-2 py-1">{s.barbeiroId}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mb-2">Produtos Vendidos</h3>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Produto</th>
              <th className="border px-2 py-1">Valor</th>
              <th className="border px-2 py-1">Data</th>
              <th className="border px-2 py-1">Barbeiro</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((p) => (
              <tr key={p.id}>
                <td className="border px-2 py-1">{p.nomeProduto}</td>
                <td className="border px-2 py-1">R$ {p.valorProduto.toFixed(2)}</td>
                <td className="border px-2 py-1">{p.data.toDate().toLocaleDateString()}</td>
                <td className="border px-2 py-1">{p.barbeiroId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
