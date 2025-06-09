import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Barbeiros() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [comServico, setComServico] = useState('');
  const [comProduto, setComProduto] = useState('');
  const [lista, setLista] = useState([]);

  const cadastrarBarbeiro = async () => {
    try {
      await addDoc(collection(db, 'barbeiros'), {
        nome,
        email,
        comissaoServico: parseFloat(comServico),
        comissaoProduto: parseFloat(comProduto)
      });
      alert('Barbeiro cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setComServico('');
      setComProduto('');
      listar();
    } catch (err) {
      alert('Erro ao cadastrar: ' + err.message);
    }
  };

  const listar = async () => {
    const snap = await getDocs(collection(db, 'barbeiros'));
    const dados = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLista(dados);
  };

  useEffect(() => {
    listar().catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Cadastro de Barbeiros</h2>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2 rounded" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 rounded" placeholder="% Comissão Serviço" value={comServico} onChange={e => setComServico(e.target.value)} />
        <input className="border p-2 rounded" placeholder="% Comissão Produto" value={comProduto} onChange={e => setComProduto(e.target.value)} />
        <button className="col-span-2 bg-black text-white p-2 rounded" onClick={cadastrarBarbeiro}>Cadastrar</button>
      </div>
      <h3 className="text-md font-semibold mt-6">Barbeiros Cadastrados</h3>
      <ul className="bg-white shadow rounded divide-y">
        {lista.map(b => (
          <li key={b.id} className="p-2">
            <strong>{b.nome}</strong> - {b.email} | Serviço: {b.comissaoServico}% | Produto: {b.comissaoProduto}%
          </li>
        ))}
      </ul>
    </div>
  );
}
