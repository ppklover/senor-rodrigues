
// App Web para Gestão da Barbearia SEÑOR RODRIGUES - Integrado com Firebase
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBS6ZmZ7PP_Og8tAOHFvFGadmh213jJ_Yw",
  authDomain: "barbearia-senorrodrigues.firebaseapp.com",
  projectId: "barbearia-senorrodrigues",
  storageBucket: "barbearia-senorrodrigues.firebasestorage.app",
  messagingSenderId: "354869185125",
  appId: "1:354869185125:web:156497774eb4871836548c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-black text-white p-4 text-center text-xl font-bold">SEÑOR RODRIGUES</header>
      <nav className="flex justify-around bg-white shadow p-2">
        <button onClick={() => setTab('dashboard')}>Dashboard</button>
        <button onClick={() => setTab('barbeiros')}>Barbeiros</button>
        <button onClick={() => setTab('caixa')}>Fluxo de Caixa</button>
        <button onClick={() => setTab('servicos')}>Serviços e Produtos</button>
        <button onClick={() => setTab('clientes')}>Clientes</button>
      </nav>
      <main className="p-4">
        {tab === 'dashboard' && <Dashboard user={user} />}
        {tab === 'barbeiros' && <Barbeiros />}
        {tab === 'caixa' && <FluxoCaixa />}
        {tab === 'servicos' && <ServicosProdutos />}
        {tab === 'clientes' && <Clientes />}
      </main>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          className="bg-black text-white w-full p-2 rounded"
          onClick={handleLogin}
        >Entrar</button>
      </div>
    </div>
  );
}

function Dashboard({ user }) {
  return <div>Bem-vindo, {user.email}! Aqui será o painel geral.</div>;
}

function Barbeiros() {
  return <div>Gestão de Barbeiros (criar, editar, comissões).</div>;
}

function FluxoCaixa() {
  return <div>Fluxo de caixa com filtros e visualização de serviços/produtos.</div>;
}

function ServicosProdutos() {
  return <div>Cadastro e gestão de serviços e produtos (com estoque).</div>;
}

function Clientes() {
  return <div>Lista de clientes, histórico de serviços e produtos.</div>;
}
