import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [servicos, setServicos] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const isAdmin = user?.email === 'jucemar@gmail.com';

  useEffect(() => {
    const fetchData = async () => {
      const servicoSnapshot = await getDocs(collection(db, 'servicos'));
      const produtoSnapshot = await getDocs(collection(db, 'produtos'));

      const servicoData = servicoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const produtoData = produtoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (isAdmin) {
        setServicos(servicoData);
        setProdutos(produtoData);
      } else {
        const userServicos = servicoData.filter(s => s.barbeiro === user.email);
        const userProdutos = produtoData.filter(p => p.barbeiro === user.email);
        setServicos(userServicos);
        setProdutos(userProdutos);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  const totalServico = servicos.reduce((sum, s) => sum + parseFloat(s.valor || 0), 0);
  const totalProduto = produtos.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0);

  const comissao = 0.3;
  const totalLiquido = isAdmin ? totalServico * (1 - comissao) : totalServico;
  const totalBruto = isAdmin ? totalServico : null;

  const chartData = {
    labels: isAdmin
      ? ['Serviços Bruto', 'Serviços Líquido', 'Produtos Vendidos']
      : ['Serviços Líquido', 'Produtos Vendidos'],
    datasets: [
      {
        data: isAdmin
          ? [totalBruto, totalLiquido, totalProduto]
          : [totalLiquido, totalProduto],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard - {isAdmin ? 'Admin' : 'Barbeiro'}</h1>

      <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-4">
        <Pie data={chartData} />
      </div>

      <div className="mt-6 text-center">
        {isAdmin ? (
          <>
            <p><strong>Serviços Bruto:</strong> R$ {totalBruto.toFixed(2)}</p>
            <p><strong>Serviços Líquido (p/ barbeiros):</strong> R$ {totalLiquido.toFixed(2)}</p>
            <p><strong>Produtos Vendidos:</strong> R$ {totalProduto.toFixed(2)}</p>
          </>
        ) : (
          <>
            <p><strong>Total em Serviços:</strong> R$ {totalLiquido.toFixed(2)}</p>
            <p><strong>Total em Produtos:</strong> R$ {totalProduto.toFixed(2)}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
