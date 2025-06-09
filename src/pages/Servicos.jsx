import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Servicos = () => {
  const { currentUser } = useAuth();
  const [tipoServico, setTipoServico] = useState('');
  const [valorServico, setValorServico] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoServico || !valorServico) {
      setMensagem('Preencha todos os campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'servicos'), {
        tipoServico,
        valorServico: parseFloat(valorServico),
        data: Timestamp.now(),
        barbeiroId: currentUser.email,
      });

      setMensagem('Serviço registrado com sucesso!');
      setTipoServico('');
      setValorServico('');
    } catch (error) {
      console.error('Erro ao registrar serviço:', error);
      setMensagem('Erro ao registrar serviço.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar Serviço</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tipo de Serviço</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={tipoServico}
            onChange={(e) => setTipoServico(e.target.value)}
            placeholder="Ex: Corte, Barba..."
          />
        </div>

        <div>
          <label className="block font-medium">Valor (R$)</label>
          <input
            type="number"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={valorServico}
            onChange={(e) => setValorServico(e.target.value)}
            step="0.01"
            placeholder="Ex: 30.00"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Salvar
        </button>

        {mensagem && <p className="text-center text-sm mt-4">{mensagem}</p>}
      </form>
    </div>
  );
};

export default Servicos;
