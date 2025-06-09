import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Barbeiros = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [comissaoServico, setComissaoServico] = useState("");
  const [comissaoProduto, setComissaoProduto] = useState("");
  const [barbeiros, setBarbeiros] = useState([]);

  const barbeirosCollection = collection(db, "barbeiros");

  const cadastrarBarbeiro = async () => {
    if (!nome || !email || !comissaoServico || !comissaoProduto) return;

    await addDoc(barbeirosCollection, {
      nome,
      email,
      comissaoServico: Number(comissaoServico),
      comissaoProduto: Number(comissaoProduto),
    });

    setNome("");
    setEmail("");
    setComissaoServico("");
    setComissaoProduto("");

    buscarBarbeiros();
  };

  const buscarBarbeiros = async () => {
    const data = await getDocs(barbeirosCollection);
    setBarbeiros(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const excluirBarbeiro = async (id) => {
    const docRef = doc(db, "barbeiros", id);
    await deleteDoc(docRef);
    buscarBarbeiros();
  };

  useEffect(() => {
    buscarBarbeiros();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cadastro de Barbeiros</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="% Comissão Serviço"
          value={comissaoServico}
          onChange={(e) => setComissaoServico(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="% Comissão Produto"
          value={comissaoProduto}
          onChange={(e) => setComissaoProduto(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <button
        onClick={cadastrarBarbeiro}
        className="bg-black text-white px-4 py-2 rounded mb-6"
      >
        Cadastrar
      </button>

      <h2 className="text-lg font-semibold mb-2">Barbeiros Cadastrados</h2>
      {barbeiros.length === 0 && <p>Nenhum barbeiro cadastrado.</p>}
      <ul>
        {barbeiros.map((barbeiro) => (
          <li
            key={barbeiro.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <strong>{barbeiro.nome}</strong> – {barbeiro.email}
              <div>
                Comissão: Serviço {barbeiro.comissaoServico}% | Produto {barbeiro.comissaoProduto}%
              </div>
            </div>
            <button
              onClick={() => excluirBarbeiro(barbeiro.id)}
              className="text-red-600 hover:underline"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Barbeiros;
