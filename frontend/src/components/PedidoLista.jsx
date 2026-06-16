const TOKEN = "meu-token-secreto-2025";
const API = "http://localhost:3001/api";

function PedidoLista({ pedidos, onAtualizado }) {
  async function alterarStatus(id, novoStatus) {
    try {
      const resposta = await fetch(`${API}/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!resposta.ok) throw new Error("Erro ao atualizar.");
      if (onAtualizado) onAtualizado();
    } catch (err) { alert(err.message); }
  }

  async function remover(id) {
    if (!confirm("Tem a certeza que quer remover este pedido?")) return;
    try {
      const resposta = await fetch(`${API}/pedidos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!resposta.ok) throw new Error("Erro ao remover.");
      if (onAtualizado) onAtualizado();
    } catch (err) { alert(err.message); }
  }

  const corStatus = {
    pendente: "#fef3c7",
    aprovado: "#d1fae5",
    entregue: "#dbeafe",
    cancelado: "#fee2e2",
  };

  return (
    <div>
      <h3>Lista de Pedidos</h3>
      {pedidos.length === 0 && <p>Nenhum pedido encontrado.</p>}
      {pedidos.map((p) => (
        <div key={p.id} style={{ ...estilos.card, background: corStatus[p.status] || "#fff" }}>
          <div style={estilos.linha}>
            <strong>Pedido #{p.id}</strong>
            <span>Total: {Number(p.total).toFixed(2)} CVE</span>
          </div>
          <p>Utilizador: {p.utilizador_nome || p.utilizador_id}</p>
          <div style={estilos.linha}>
            <select value={p.status} onChange={(e) => alterarStatus(p.id, e.target.value)} style={estilos.select}>
              {["pendente", "aprovado", "entregue", "cancelado"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={() => remover(p.id)} style={estilos.btnRemover}>Remover</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const estilos = {
  card: { padding: "12px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #e5e7eb" },
  linha: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  select: { padding: "4px 8px", borderRadius: "4px", border: "1px solid #d1d5db" },
  btnRemover: { padding: "4px 10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
};

export default PedidoLista;
