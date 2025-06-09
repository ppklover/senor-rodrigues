import { useState } from 'react';
import Barbeiros from './Barbeiros';

export default function App() {
  const [tab, setTab] = useState('barbeiros');

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-black text-white p-4 text-center text-xl font-bold">SEÑOR RODRIGUES</header>
      <nav className="flex justify-around bg-white shadow p-2">
        <button onClick={() => setTab('dashboard')}>Dashboard</button>
        <button onClick={() => setTab('barbeiros')}>Barbeiros</button>
      </nav>
      <main className="p-4">
        {tab === 'barbeiros' && <Barbeiros />}
        {tab === 'dashboard' && <div>Painel geral</div>}
      </main>
    </div>
  );
}
