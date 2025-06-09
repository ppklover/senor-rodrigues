import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [filtros, setFiltros] = useState({
    tipo: '',
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    const fetchServicos = async () => {
      const servicosRef = collection(db, 'servicos');
      const snapshot = await getDocs(servicosRef);
      const servicosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const meusServicos = servicosData.filter(s => s.barbeiroId === user.uid);
      setServicos(meusServicos);
    };

    fetchServicos();
  }, [user]);

  const filtrarServicos = () => {
    return servicos.filter(servico => {
      const dataServico = servico.data?.toDate();
      const dataInicio = filtros.dataInicio ? new Date(filtros.dataInicio) : null;
      const dataFim = filtros.dataFim ? new Date(filtros.dataFim + 'T23:59:59') : null;

      return (
        (!filtros.tipo || servico.tipo === filtros.tipo) &&
        (!dataInicio || (dataServico && dataServico >= dataInicio)) &&
        (!dataFim || (dataServico && dataServico <= dataFim))
      );
    });
  };

  const servicosFiltrados = filtrarServicos();
  const totalLiquido = servicosFiltrados.reduce((acc, s) => {
    const comissao = s.comissaoBarbeiro || 0;
    return acc + (s.valor * comissao / 100);
  }, 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Meu Painel Financeiro</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      <div className="bg-green-100 p-4 rounded shadow mb-6">
        <h3 className="font-bold">Total Recebido (Líquido)</h3>
        <p className="text-2xl font-semibold text-green-800">R$ {totalLiquido.toFixed(2)}</p>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Meus Serviços</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Data</th>
                <th className="p-2 border">Tipo</th>
                <th className="p-2 border">Valor</th>
                <th className="p-2 border">Comissão</th>
              </tr>
            </thead>
            <tbody>
              {servicosFiltrados.map(s => (
                <tr key={s.id}>
                  <td className="p-2 border">{s.data?.toDate().toLocaleDateString()}</td>
                  <td className="p-2 border">{s.tipo}</td>
                  <td className="p-2 border">R$ {s.valor.toFixed(2)}</td>
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
