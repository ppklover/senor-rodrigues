import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [filtros, setFiltros] = useState({
    barbeiroId: '',
    tipo: '',
    dataInicio: '',
    dataFim: '',
  });

  useEffect(() => {
    const fetchServicos = async () => {
      const servicosRef = collection(db, 'servicos');
      const snapshot = await getDocs(servicosRef);
      const servicosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServicos(servicosData);
    };

    const fetchBarbeiros = async () => {
      const barbeirosRef = collection(db, 'barbeiros');
      const snapshot = await getDocs(barbeirosRef);
      const barbeirosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBarbeiros(barbeirosData);
    };

    fetchServicos();
    fetchBarbeiros();
  }, []);

  const filtrarServicos = () => {
    return servicos.filter(servico => {
      const dataServico = servico.data?.toDate();
      const dataInicio = filtros.dataInicio ? new Date(filtros.dataInicio) : null;
      const dataFim = filtros.dataFim ? new Date(filtros.dataFim + 'T23:59:59') : null;

      const condicoes = [
        !filtros.barbeiroId || servico.barbeiroId === filtros.barbeiroId,
        !filtros.tipo || servico.tipo === filtros.tipo,
        !dataInicio || (dataServico && dataServico >= dataInicio),
        !dataFim || (dataServico && dataServico <= dataFim),
      ];

      return condicoes.every(Boolean);
    });
  };

  const servicosFiltrados = filtrarServicos();

  const totalBruto = servicosFiltrados.reduce((acc, s) => acc + s.valor, 0);
  const totalLiquido = servicosFiltrados.reduce((acc, s) => {
    const comissao = s.comissaoBarbeiro || 0;
    return acc + (s.valor * comissao / 100);
  }, 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard Financeiro - ADMIN</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label>Barbeiro</label>
          <select
            className="w-full p-2 border rounded"
            value={filtros.barbeiroId}
            onChange={e => setFiltros({ ...filtros, barbeiroId: e.target.value })}
          >
            <option value="">Todos</option>
            {barbeiros.map(b => (
              <option key={b.id} value={b.id}>{b.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Tipo de Serviço</label>
          <select
            className="w-full p-2 border rounded"
            value={filtros.tipo}
            onChange={e => setFiltros({ ...filtros, tipo: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="Corte">Corte</option>
            <option value="Barba">Barba</option>
            <option value="Sobrancelha">Sobrancelha</option>
          </select>
        </div>
        <div>
          <label>Data Início</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={filtros.dataInicio}
            onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })}
          />
        </div>
        <div>
          <label>Data Fim</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={filtros.dataFim}
            onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="font-bold">Total Bruto</h3>
          <p className="text-xl font-semibold text-blue-800">R$ {totalBruto.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="font-bold">Total Líquido (Comissão)</h3>
          <p className="text-xl font-semibold text-green-800">R$ {totalLiquido.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Serviços</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Data</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Valor</th>
                <th className="p-2 border">Barbeiro</th>
                <th className="p-2 border">Comissão</th>
              </tr>
            </thead>
            <tbody>
              {servicosFiltrados.map(s => (
                <tr key={s.id}>
                  <td className="p-2 border">{s.data?.toDate().toLocaleDateString()}</td>
                  <td className="p-2 border">{s.tipo}</td>
                  <td className="p-2 border">R$ {s.valor.toFixed(2)}</td>
                  <td className="p-2 border">{barbeiros.find(b => b.id === s.barbeiroId)?.nome || 'Desconhecido'}</td>
                  <td className="p-2 border">{s.comissaoBarbeiro || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
