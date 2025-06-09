import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const buscarProdutos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const lista = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProdutos(lista);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const atualizarEstoque = async (id, novoEstoque) => {
    try {
      const docRef = doc(db, 'produtos', id);
      await updateDoc(docRef, { estoque: parseInt(novoEstoque) });
      setProdutos((prev) =>
        prev.map((produto) =>
          produto.id === id ? { ...produto, estoque: parseInt(novoEstoque) } : produto
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  if (carregando) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Estoque de Produtos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Nome</th>
              <th className="py-2 px-4 border-b text-left">Categoria</th>
              <th className="py-2 px-4 border-b text-left">Preço</th>
              <th className="py-2 px-4 border-b text-left">Estoque</th>
              <th className="py-2 px-4 border-b text-left">Atualizar</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td className="py-2 px-4 border-b">{produto.nome}</td>
                <td className="py-2 px-4 border-b">{produto.categoria}</td>
                <td className="py-2 px-4 border-b">R$ {parseFloat(produto.preco).toFixed(2)}</td>
                <td
                  className={`py-2 px-4 border-b ${
                    produto.estoque < 5 ? 'text-red-500 font-bold' : ''
                  }`}
                >
                  {produto.estoque}
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    defaultValue={produto.estoque}
                    className="w-20 border px-2 py-1 rounded"
                    onBlur={(e) => atualizarEstoque(produto.id, e.target.value)}
                    min={0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estoque;
