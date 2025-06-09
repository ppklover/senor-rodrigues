import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Dashboard = () => {
  const agendamentosData = {
    labels: ['Realizados', 'Cancelados', 'Pendentes'],
    datasets: [
      {
        data: [60, 15, 25],
        backgroundColor: ['#22c55e', '#ef4444', '#facc15'],
      },
    ],
  };

  const barbeirosData = {
    labels: ['João', 'Carlos', 'Mateus', 'Pedro'],
    datasets: [
      {
        label: 'Atendimentos no mês',
        data: [20, 35, 15, 10],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Agendamentos</h2>
          <Pie data={agendamentosData} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Atendimentos por Barbeiro</h2>
          <Bar data={barbeirosData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
