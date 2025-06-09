import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';

const Produtos = () => {
  const { currentUser, userType } = useContext(AuthContext);
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [produtosList, setProdutosList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!produto || !valor || !data) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      await addDoc(collection(db, 'produtos'), {
        nome: produto,
        valor: parseFloat(valor),
        data,
        barbeiroId: currentUser.uid,
        barbeiroNome: currentUser.displayName || '',
        criadoEm: serverTimestamp(),
      });

      setProduto('');
      setValor('');
      setData('');
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const fetchProdutos = async () => {
    try {
      const q = query(collection(db, 'produtos'), where('barbeiroId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProdutosList(lista);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    if (userType === 'barbeiro') {
      fetchProdutos();
    }
  }, [userType]);

  if (userType !== 'barbeiro') {
    return <div className="p-4 text-red-600">Acesso restrito aos barbeiros.</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Produto Vendido</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Produto</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            placeholder="Nome do produto"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Valor</label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 p-2 rounded"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Valor R$"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Data</label>
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Cadastrar Produto
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-2">Produtos Vendidos</h3>
      <ul className="space-y-2">
        {produtosList.map((item) => (
          <li key={item.id} className="border p-2 rounded bg-gray-50">
            <div className="font-medium">{item.nome}</div>
            <div>R$ {item.valor?.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Data: {item.data}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Produtos;
