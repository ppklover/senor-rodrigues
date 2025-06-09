
import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [financas, setFinancas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("Entrada");

  useEffect(() => {
    const barbeirosLocal = JSON.parse(localStorage.getItem("barbeiros")) || [];
    const estoqueLocal = JSON.parse(localStorage.getItem("estoque")) || [];
    const financasLocal = JSON.parse(localStorage.getItem("financas")) || [];
    setBarbeiros(barbeirosLocal);
    setEstoque(estoqueLocal);
    setFinancas(financasLocal);
  }, []);

  const calcularSaldo = () => {
    return financas.reduce((acc, mov) => acc + (mov.tipo === "Entrada" ? parseFloat(mov.valor) : -parseFloat(mov.valor)), 0);
  };

  const adicionarMovimento = () => {
    if (!descricao || !valor) return;
    const novoMovimento = {
      data: new Date().toISOString().split("T")[0],
      descricao,
      tipo,
      valor: parseFloat(valor)
    };
    const novaLista = [...financas, novoMovimento];
    setFinancas(novaLista);
    localStorage.setItem("financas", JSON.stringify(novaLista));
    setDescricao("");
    setValor("");
    setTipo("Entrada");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Relatórios</h1>

      <div className="mb-6">
        <h2 className="font-semibold">Total de Barbeiros: {barbeiros.length}</h2>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold">Estoque</h2>
        <ul className="list-disc ml-6">
          {estoque.map((item, index) => (
            <li key={index}>{item.nome} - {item.quantidade}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold">Finanças</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="border px-2 py-1 rounded w-1/3"
          />
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="border px-2 py-1 rounded w-1/4"
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border px-2 py-1 rounded w-1/4"
          >
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </select>
          <button
            onClick={adicionarMovimento}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Adicionar
          </button>
        </div>
        <table className="table-auto w-full border mt-2">
          <thead>
            <tr>
              <th className="border px-2 py-1">Data</th>
              <th className="border px-2 py-1">Descrição</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {financas.map((mov, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{mov.data}</td>
                <td className="border px-2 py-1">{mov.descricao}</td>
                <td className="border px-2 py-1">{mov.tipo}</td>
                <td className="border px-2 py-1">{mov.valor.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 font-bold">Saldo Atual: R$ {calcularSaldo().toFixed(2)}</div>
      </div>
    </div>
  );
};

export default Reports;
