import { useState } from "react";

const TOKEN = "meu-token-secreto-2025";
const API = "http://localhost:3001/api";

function ProdutoLista({ produtos, onAtualizado }) {
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  function iniciarEdicao(produto) {
    setEditando(produto.id);
    setForm({ nome: produto.nome, descricao: produto.descricao, preco: produto.preco, stock: produto.stock });
  }

  async function salvarEdicao(id) {
    try {
      const resposta = await fetch(`${API}/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify(form),
      });
      if (!resposta.ok) throw new Error("Erro ao atualizar.");
      setEditando(null);
      if (onAtualizado) onAtualizado();
    } catch (err) { alert(err.message); }
  }

  async function remover(id) {
    if (!confirm("Remover produto?")) return;
    try {
      const resposta = await fetch(`${API}/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!resposta.ok) throw new Error("Erro ao remover.");
      if (onAtualizado) onAtualizado();
    } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <h3>Lista de Produtos</h3>
      {produtos.length === 0 && <p>Nenhum produto encontrado.</p>}
      {produtos.map((p) => (
        <div key={p.id} style={estilos.card}>
          {editando === p.id ? (
            <div>
              <input style={estilos.input} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" />
              <input style={estilos.input} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" />
              <input style={estilos.input} type="number" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="Preço" />
              <input style={estilos.input} type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" />
              <button onClick={() => salvarEdicao(p.id)} style={estilos.btnSalvar}>Salvar</button>
              <button onClick={() => setEditando(null)} style={estilos.btnCancelar}>Cancelar</button>
            </div>
          ) : (
            <div>
              <div style={estilos.linha}>
                <strong>{p.nome}</strong>
                <span>{Number(p.preco).toFixed(2)} CVE</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>{p.descricao}</p>
              <p>Stock: {p.stock}</p>
              <div style={estilos.acoes}>
                <button onClick={() => iniciarEdicao(p)} style={estilos.btnEditar}>Editar</button>
                <button onClick={() => remover(p.id)} style={estilos.btnRemover}>Remover</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const estilos = {
  card: { padding: "12px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #e5e7eb", background: "#fff" },
  linha: { display: "flex", justifyContent: "space-between", marginBottom: "4px" },
  input: { display: "block", width: "100%", marginBottom: "6px", padding: "6px", boxSizing: "border-box" },
  acoes: { display: "flex", gap: "8px", marginTop: "8px" },
  btnEditar: { padding: "4px 10px", background: "#fef3c7", border: "none", borderRadius: "4px", cursor: "pointer" },
  btnRemover: { padding: "4px 10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  btnSalvar: { padding: "4px 10px", background: "#22c55e", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px" },
  btnCancelar: { padding: "4px 10px", background: "#e5e7eb", border: "none", borderRadius: "4px", cursor: "pointer" },
};

export default ProdutoLista;
