// src/pages/Servicos.jsx
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Servicos = () => {
  const [tipoServico, setTipoServico] = useState('');
  const [valorServico, setValorServico] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoServico || !valorServico) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      await addDoc(collection(db, 'servicos'), {
        tipoServico,
        valorServico: parseFloat(valorServico),
        data: Timestamp.now(),
        barbeiroId: currentUser.email,
      });

      setTipoServico('');
      setValorServico('');
      alert('Serviço registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      alert('Erro ao adicionar serviço');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Registrar Serviço</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Serviço</label>
          <input
            type="text"
            value={tipoServico}
            onChange={(e) => setTipoServico(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Ex: Corte, Barba"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <input
            type="number"
            value={valorServico}
            onChange={(e) => setValorServico(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Ex: 30"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Salvar Serviço
        </button>
      </form>
    </div>
  );
};

export default Servicos;
