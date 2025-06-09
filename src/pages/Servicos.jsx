import React, { useState, useContext } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';

function Servicos() {
  const { currentUser } = useContext(AuthContext);
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo || !valor || !data) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      await addDoc(collection(db, 'servicos'), {
        tipo,
        valor: parseFloat(valor),
        data,
        barbeiroId: currentUser.uid,
        barbeiroNome: currentUser.displayName || currentUser.email,
        criadoEm: new Date()
      });
      setTipo('');
      setValor('');
      setData('');
      alert('Serviço registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Registrar Serviço</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Tipo de Serviço</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Ex: Corte, Barba, Sobrancelha"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Valor (R$)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Ex: 25"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Data</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Salvar Serviço
        </button>
      </form>
    </div>
  );
}

export default Servicos;
