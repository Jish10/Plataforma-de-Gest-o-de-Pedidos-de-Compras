import { useState } from "react";

const TOKEN = "meu-token-secreto-2025";
const API = "http://localhost:3001/api";

function PedidoForm({ onCriado }) {
  const [utilizadorId, setUtilizadorId] = useState("");
  const [itens, setItens] = useState([{ produto_id: "", quantidade: 1 }]);
  const [mensagem, setMensagem] = useState(null);

  function adicionarItem() {
    setItens([...itens, { produto_id: "", quantidade: 1 }]);
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  function alterarItem(index, campo, valor) {
    const copia = [...itens];
    copia[index][campo] = valor;
    setItens(copia);
  }

  async function submeter(e) {
    e.preventDefault();
    setMensagem(null);
    try {
      const resposta = await fetch(`${API}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({ utilizador_id: Number(utilizadorId), itens }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.mensagem);
      setMensagem({ tipo: "sucesso", texto: "Pedido criado com sucesso!" });
      setUtilizadorId("");
      setItens([{ produto_id: "", quantidade: 1 }]);
      if (onCriado) onCriado();
    } catch (err) {
      setMensagem({ tipo: "erro", texto: err.message });
    }
  }

  return (
    <form onSubmit={submeter} style={estilos.form}>
      <h3>Novo Pedido</h3>
      {mensagem && <p style={mensagem.tipo === "sucesso" ? estilos.sucesso : estilos.erro}>{mensagem.texto}</p>}
      <label>ID do Utilizador</label>
      <input type="number" value={utilizadorId} onChange={(e) => setUtilizadorId(e.target.value)} required style={estilos.input} />
      <h4>Itens</h4>
      {itens.map((item, i) => (
        <div key={i} style={estilos.itemRow}>
          <input type="number" placeholder="ID Produto" value={item.produto_id} onChange={(e) => alterarItem(i, "produto_id", Number(e.target.value))} required style={{ ...estilos.input, width: "120px" }} />
          <input type="number" placeholder="Qtd" value={item.quantidade} min={1} onChange={(e) => alterarItem(i, "quantidade", Number(e.target.value))} required style={{ ...estilos.input, width: "80px" }} />
          {itens.length > 1 && (
            <button type="button" onClick={() => removerItem(i)} style={estilos.btnRemover}>Remover</button>
          )}
        </div>
      ))}
      <button type="button" onClick={adicionarItem} style={estilos.btnSecundario}>+ Adicionar Item</button>
      <button type="submit" style={estilos.btnPrincipal}>Criar Pedido</button>
    </form>
  );
}

const estilos = {
  form: { background: "#f9f9f9", padding: "16px", borderRadius: "8px", marginBottom: "24px" },
  input: { display: "block", marginBottom: "8px", padding: "6px", width: "100%", boxSizing: "border-box" },
  itemRow: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" },
  btnPrincipal: { marginTop: "12px", padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  btnSecundario: { padding: "6px 12px", background: "#e5e7eb", border: "none", borderRadius: "4px", cursor: "pointer" },
  btnRemover: { padding: "4px 10px", background: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: "4px", cursor: "pointer" },
  sucesso: { color: "green" },
  erro: { color: "red" },
};

export default PedidoForm;
