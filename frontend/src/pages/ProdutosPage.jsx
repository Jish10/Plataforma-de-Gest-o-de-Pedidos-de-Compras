import { useState, useEffect } from "react";
import ProdutoLista from "../components/ProdutoLista";

const TOKEN = "meu-token-secreto-2025";
const API = "http://localhost:3001/api";

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "", stock: "" });
  const [mensagem, setMensagem] = useState(null);

  async function carregarProdutos() {
    setErro(null);
    try {
      const resposta = await fetch(`${API}/produtos`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!resposta.ok) throw new Error("Erro ao carregar produtos.");
      setProdutos(await resposta.json());
    } catch (err) {
      setErro(err.message);
    }
  }

  async function criarProduto(e) {
    e.preventDefault();
    setMensagem(null);
    try {
      const resposta = await fetch(`${API}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify(form),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.mensagem);
      setMensagem({ tipo: "sucesso", texto: "Produto criado!" });
      setForm({ nome: "", descricao: "", preco: "", stock: "" });
      carregarProdutos();
    } catch (err) {
      setMensagem({ tipo: "erro", texto: err.message });
    }
  }

  useEffect(() => {
  let activo = true;
  async function carregar() {
    setErro(null);
    try {
      const resposta = await fetch(`${API}/produtos`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!resposta.ok) throw new Error("Erro ao carregar produtos.");
      if (activo) setProdutos(await resposta.json());
    } catch (err) {
      if (activo) setErro(err.message);
    }
  }
  carregar();
  return () => { activo = false; };
}, []);

  return (
    <div>
      <h2>Gestão de Produtos</h2>
      <form onSubmit={criarProduto} style={estilos.form}>
        <h3>Novo Produto</h3>
        {mensagem && <p style={mensagem.tipo === "sucesso" ? estilos.sucesso : estilos.erro}>{mensagem.texto}</p>}
        <input style={estilos.input} placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input style={estilos.input} placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        <input style={estilos.input} placeholder="Preço" type="number" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required />
        <input style={estilos.input} placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <button type="submit" style={estilos.btn}>Criar Produto</button>
      </form>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <ProdutoLista produtos={produtos} onAtualizado={carregarProdutos} />
    </div>
  );
}

const estilos = {
  form: { background: "#f9f9f9", padding: "16px", borderRadius: "8px", marginBottom: "24px" },
  input: { display: "block", width: "100%", marginBottom: "8px", padding: "6px", boxSizing: "border-box" },
  btn: { padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  sucesso: { color: "green" },
  erro: { color: "red" },
};

export default ProdutosPage;
