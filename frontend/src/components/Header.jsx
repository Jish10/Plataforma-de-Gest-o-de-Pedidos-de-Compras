function Header({ onLogout }) {
  return (
    <header className="topbar">
      <div>
        <strong>Compras CV</strong>
        <span>Plataforma de Gestão de Pedidos de Compras</span>
      </div>
      <button type="button" className="secondary" onClick={onLogout}>
        Sair
      </button>
    </header>
  );
}

export default Header;
