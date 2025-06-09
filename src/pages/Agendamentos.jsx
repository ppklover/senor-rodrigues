import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Agendamentos = () => {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [servico, setServico] = useState('');
  const [barbeiro, setBarbeiro] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  const buscarAgendamentos = async () => {
    const querySnapshot = await getDocs(collection(db, 'agendamentos'));
    const lista = [];
    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    setAgendamentos(lista);
  };

  const cadastrarAgendamento = async () => {
    if (!nome || !data || !hora || !servico || !barbeiro) {
      alert('Preencha todos os campos');
      return;
    }

    await addDoc(collection(db, 'agendamentos'), {
      nome,
      data,
      hora,
      servico,
      barbeiro,
    });

    setNome('');
    setData('');
    setHora('');
    setServico('');
    setBarbeiro('');
    buscarAgendamentos();
  };

  const excluirAgendamento = async (id) => {
    await deleteDoc(doc(db, 'agendamentos', id));
    buscarAgendamentos();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Cadastro de Agendamentos</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <input
          type="text"
          placeholder="Nome do Cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Serviço"
          value={servico}
          onChange={(e) => setServico(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Barbeiro"
          value={barbeiro}
          onChange={(e) => setBarbeiro(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <button
        onClick={cadastrarAgendamento}
        className="bg-black text-white px-4 py-2 mb-6"
      >
        Cadastrar
      </button>

      <h2 className="text-lg font-bold mb-2">Agendamentos Cadastrados</h2>
      <ul>
        {agendamentos.map((ag) => (
          <li key={ag.id} className="mb-2">
            <span className="font-semibold">{ag.nome}</span> - {ag.data} às {ag.hora} - {ag.servico} com {ag.barbeiro}
            <button
              onClick={() => excluirAgendamento(ag.id)}
              className="ml-4 text-red-500"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Agendamentos;
