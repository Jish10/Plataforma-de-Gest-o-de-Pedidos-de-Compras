import { useState } from "react";
import PedidosPage from "./pages/PedidosPage";
import ProdutosPage from "./pages/ProdutosPage";

function App() {
  const [pagina, setPagina] = useState("pedidos");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ borderBottom: "2px solid #2563eb", paddingBottom: "12px" }}>
        Gestão de Pedidos de Compras
      </h1>
      <nav style={{ marginBottom: "24px", display: "flex", gap: "12px" }}>
        <button
          onClick={() => setPagina("pedidos")}
          style={{ padding: "8px 16px", background: pagina === "pedidos" ? "#2563eb" : "#e5e7eb", color: pagina === "pedidos" ? "#fff" : "#000", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Pedidos
        </button>
        <button
          onClick={() => setPagina("produtos")}
          style={{ padding: "8px 16px", background: pagina === "produtos" ? "#2563eb" : "#e5e7eb", color: pagina === "produtos" ? "#fff" : "#000", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Produtos
        </button>
      </nav>
      {pagina === "pedidos" ? <PedidosPage /> : <ProdutosPage />}
    </div>
  );
}

export default App;
