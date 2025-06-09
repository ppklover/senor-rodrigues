import React, { useEffect, useState, useContext } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [servicos, setServicos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    barbeiro: '',
    tipoServico: ''
  });

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

  const filtrarDados = () => {
    return servicos.filter((s) => {
      const dataServico = new Date(s.data);
      const dataInicio = filtros.dataInicio ? new Date(filtros.dataInicio) : null;
      const dataFim = filtros.dataFim ? new Date(filtros.dataFim) : null;
      const barbeiroMatch = filtros.barbeiro ? s.barbeiro === filtros.barbeiro : true;
      const tipoServicoMatch = filtros.tipoServico ? s.tipo === filtros.tipoServico : true;
      const dataMatch =
        (!dataInicio || dataServico >= dataInicio) &&
        (!dataFim || dataServico <= dataFim);

      return barbeiroMatch && tipoServicoMatch && dataMatch;
    });
  };

  const servicosFiltrados = filtrarDados();

  const totalBruto = servicosFiltrados.reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0);
  const totalLiquido = totalBruto * 0.6;

  const totalProdutos = produtos.reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0);

  const valoresPorBarbeiro = {};
  servicosFiltrados.forEach((s) => {
    if (!valoresPorBarbeiro[s.barbeiro]) {
      valoresPorBarbeiro[s.barbeiro] = 0;
    }
    valoresPorBarbeiro[s.barbeiro] += parseFloat(s.valor || 0);
  });

  const valoresPorTipo = {};
  servicosFiltrados.forEach((s) => {
    if (!valoresPorTipo[s.tipo]) {
      valoresPorTipo[s.tipo] = 0;
    }
    valoresPorTipo[s.tipo] += parseFloat(s.valor || 0);
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard - ADMIN</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Total Bruto (serviços)</p>
          <p className="text-xl font-bold text-green-700">R$ {totalBruto.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Total Líquido (60%)</p>
          <p className="text-xl font-bold text-blue-700">R$ {totalLiquido.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Total Produtos Vendidos</p>
          <p className="text-xl font-bold text-purple-700">R$ {totalProdutos.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input type="date" className="border p-2 rounded" onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })} />
        <input type="date" className="border p-2 rounded" onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })} />
        <input type="text" placeholder="Filtrar por barbeiro" className="border p-2 rounded" onChange={e => setFiltros({ ...filtros, barbeiro: e.target.value })} />
        <input type="text" placeholder="Filtrar por serviço" className="border p-2 rounded" onChange={e => setFiltros({ ...filtros, tipoServico: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-center">Distribuição por Barbeiro</h3>
          <Pie data={{
            labels: Object.keys(valoresPorBarbeiro),
            datasets: [{
              data: Object.values(valoresPorBarbeiro),
              backgroundColor: ['#4ade80', '#60a5fa', '#facc15', '#f87171']
            }]
          }} />
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-center">Distribuição por Serviço</h3>
          <Pie data={{
            labels: Object.keys(valoresPorTipo),
            datasets: [{
              data: Object.values(valoresPorTipo),
              backgroundColor: ['#fbbf24', '#34d399', '#93c5fd', '#f472b6']
            }]
          }} />
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-center">Serviços vs Produtos</h3>
          <Pie data={{
            labels: ['Serviços (Bruto)', 'Produtos Vendidos'],
            datasets: [{
              data: [totalBruto, totalProdutos],
              backgroundColor: ['#f87171', '#6366f1']
            }]
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
