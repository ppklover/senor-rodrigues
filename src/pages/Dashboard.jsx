import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [totalLiquido, setTotalLiquido] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const fetchServicos = async () => {
      let q = query(collection(db, 'servicos'), where('barbeiroId', '==', currentUser.email));

      const querySnapshot = await getDocs(q);
      const data = [];

      querySnapshot.forEach((doc) => {
        const servico = doc.data();
        data.push({ ...servico, id: doc.id });
      });

      setServicos(data);
    };

    fetchServicos();
  }, [currentUser]);

  useEffect(() => {
    const calcularTotal = () => {
      let filtrados = servicos;

      if (filtroTipo) {
        filtrados = filtrados.filter((s) => s.tipoServico === filtroTipo);
      }

      if (filtroData) {
        filtrados = filtrados.filter((s) => {
          const dataServico = s.data.toDate().toISOString().split('T')[0];
          return dataServico === filtroData;
        });
      }

      const total = filtrados.reduce((acc, curr) => acc + curr.valorServico * 0.6, 0); // 60% comissão
      setTotalLiquido(total.toFixed(2));
    };

    calcularTotal();
  }, [filtroData, filtroTipo, servicos]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard do Barbeiro</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div>
          <label>Filtrar por Data:</label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="border p-2 rounded ml-2"
          />
        </div>
        <div>
          <label>Filtrar por Tipo:</label>
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
      </div>

      <div className="text-lg font-semibold">
        Total Líquido: <span className="text-green-600">R$ {totalLiquido}</span>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Serviços Registrados</h3>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Valor</th>
              <th className="border px-2 py-1">Data</th>
            </tr>
          </thead>
          <tbody>
            {servicos
              .filter((s) => {
                const dataOk = filtroData
                  ? s.data.toDate().toISOString().split('T')[0] === filtroData
                  : true;
                const tipoOk = filtroTipo ? s.tipoServico === filtroTipo : true;
                return dataOk && tipoOk;
              })
              .map((s) => (
                <tr key={s.id}>
                  <td className="border px-2 py-1">{s.tipoServico}</td>
                  <td className="border px-2 py-1">R$ {s.valorServico.toFixed(2)}</td>
                  <td className="border px-2 py-1">{s.data.toDate().toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
