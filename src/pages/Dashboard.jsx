
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [filtroBarbeiro, setFiltroBarbeiro] = useState('');
  const [filtroTipoServico, setFiltroTipoServico] = useState('');
  const [filtroData, setFiltroData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const servicosSnapshot = await getDocs(collection(db, 'servicos'));
      const produtosSnapshot = await getDocs(collection(db, 'produtos'));

      const servicosData = servicosSnapshot.docs.map(doc => doc.data());
      const produtosData = produtosSnapshot.docs.map(doc => doc.data());

      setServicos(servicosData);
      setProdutos(produtosData);
    };

    fetchData();
  }, []);

  const servicosFiltrados = servicos.filter(servico => {
    const data = servico.data?.toDate().toISOString().split('T')[0];
    const dataFiltro = filtroData ? new Date(filtroData).toISOString().split('T')[0] : '';
    return (
      (!filtroBarbeiro || servico.barbeiroId === filtroBarbeiro) &&
      (!filtroTipoServico || servico.tipoServico === filtroTipoServico) &&
      (!filtroData || data === dataFiltro)
    );
  });

  const produtosFiltrados = produtos.filter(produto => {
    const data = produto.data?.toDate().toISOString().split('T')[0];
    const dataFiltro = filtroData ? new Date(filtroData).toISOString().split('T')[0] : '';
    return (
      (!filtroBarbeiro || produto.barbeiroId === filtroBarbeiro) &&
      (!filtroData || data === dataFiltro)
    );
  });

  const totalBruto = servicosFiltrados.reduce((acc, curr) => acc + curr.valorServico, 0);
  const totalLiquido = totalBruto * 0.6;
  const totalProdutos = produtosFiltrados.reduce((acc, curr) => acc + curr.valorProduto, 0);

  const barbeirosUnicos = [...new Set(servicos.map(s => s.barbeiroId))];
  const tipos = [...new Set(servicos.map(s => s.tipoServico))];

  const dadosBrutosPorTipo = tipos.map(tipo =>
    servicosFiltrados.filter(s => s.tipoServico === tipo).reduce((acc, curr) => acc + curr.valorServico, 0)
  );
  const dadosLiquidosPorTipo = dadosBrutosPorTipo.map(valor => valor * 0.6);
  const dadosPorBarbeiro = barbeirosUnicos.map(id =>
    servicosFiltrados.filter(s => s.barbeiroId === id).reduce((acc, curr) => acc + curr.valorServico, 0)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard - Admin</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <select onChange={(e) => setFiltroBarbeiro(e.target.value)} className="border p-2 rounded">
          <option value="">Todos os Barbeiros</option>
          {barbeirosUnicos.map((id, idx) => (
            <option key={idx} value={id}>{id}</option>
          ))}
        </select>

        <select onChange={(e) => setFiltroTipoServico(e.target.value)} className="border p-2 rounded">
          <option value="">Todos os Serviços</option>
          {tipos.map((tipo, idx) => (
            <option key={idx} value={tipo}>{tipo}</option>
          ))}
        </select>

        <input type="date" onChange={(e) => setFiltroData(e.target.value)} className="border p-2 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Bruto (Serviços)</h2>
          <p className="text-xl font-bold">R$ {totalBruto.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Líquido (60%)</h2>
          <p className="text-xl font-bold">R$ {totalLiquido.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Produtos Vendidos</h2>
          <p className="text-xl font-bold">R$ {totalProdutos.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-center font-semibold mb-2">Serviços Brutos por Tipo</h4>
          <Pie data={{
            labels: tipos,
            datasets: [{
              data: dadosBrutosPorTipo,
              backgroundColor: ['#60a5fa', '#34d399', '#fbbf24'],
              borderWidth: 1,
            }],
          }} />
        </div>
        <div>
          <h4 className="text-center font-semibold mb-2">Serviços Líquidos por Tipo</h4>
          <Pie data={{
            labels: tipos,
            datasets: [{
              data: dadosLiquidosPorTipo,
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
              borderWidth: 1,
            }],
          }} />
        </div>
        <div>
          <h4 className="text-center font-semibold mb-2">Distribuição por Barbeiro</h4>
          <Pie data={{
            labels: barbeirosUnicos,
            datasets: [{
              data: dadosPorBarbeiro,
              backgroundColor: ['#818cf8', '#f87171', '#4ade80', '#facc15', '#38bdf8'],
              borderWidth: 1,
            }],
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
