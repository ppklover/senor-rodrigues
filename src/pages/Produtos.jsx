import React, { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ nome: '', categoria: '', preco: '', estoque: '' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'produtos'), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(lista);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const adicionarProduto = async e => {
    e.preventDefault();
    if (!form.nome || !form.preco || !form.estoque) return;
    await addDoc(collection(db, 'produtos'), {
      nome: form.nome,
      categoria: form.categoria,
      preco: parseFloat(form.preco),
      estoque: parseInt(form.estoque)
    });
    setForm({ nome: '', categoria: '', preco: '', estoque: '' });
  };

  const excluirProduto = async (id) => {
    await deleteDoc(doc(db, 'produtos', id));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Gerenciar Produtos</h1>

      <form onSubmit={adicionarProduto} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} className="border p-2 rounded" required />
        <input name="categoria" placeholder="Categoria" value={form.categoria} onChange={handleChange} className="border p-2 rounded" />
        <input name="preco" placeholder="Preço" value={form.preco} onChange={handleChange} type="number" step="0.01" className="border p-2 rounded" required />
        <input name="estoque" placeholder="Estoque" value={form.estoque} onChange={handleChange} type="number" className="border p-2 rounded" required />
        <button type="submit" className="bg-green-500 text-white rounded p-2 col-span-1 sm:col-span-4">Adicionar Produto</button>
      </form>

      <ul className="space-y-2">
        {produtos.map(prod => (
          <li key={prod.id} className="flex justify-between items-center border p-2 rounded">
            <span>{prod.nome} - R${prod.preco?.toFixed(2)} - Estoque: {prod.estoque}</span>
            <button onClick={() => excluirProduto(prod.id)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Produtos;
