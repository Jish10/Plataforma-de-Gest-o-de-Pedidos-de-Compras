import { useState, useEffect } from "react";
import PedidoForm from "../components/PedidoForm";
import PedidoLista from "../components/PedidoLista";

const TOKEN = "meu-token-secreto-2025";
const API = "http://localhost:3001/api";

function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState(null);

  async function carregarPedidos() {
    setErro(null);
    try {
      const resposta = await fetch(`${API}/pedidos`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!resposta.ok) throw new Error("Erro ao carregar pedidos.");
      setPedidos(await resposta.json());
    } catch (err) {
      setErro(err.message);
    }
  }

  useEffect(() => {
  let activo = true;
  async function carregar() {
    setErro(null);
    try {
      const resposta = await fetch(`${API}/pedidos`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!resposta.ok) throw new Error("Erro ao carregar pedidos.");
      if (activo) setPedidos(await resposta.json());
    } catch (err) {
      if (activo) setErro(err.message);
    }
  }
  carregar();
  return () => { activo = false; };
}, []);

  return (
    <div>
      <h2>Gestão de Pedidos</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <PedidoForm onCriado={carregarPedidos} />
      <PedidoLista pedidos={pedidos} onAtualizado={carregarPedidos} />
    </div>
  );
}

export default PedidosPage;
