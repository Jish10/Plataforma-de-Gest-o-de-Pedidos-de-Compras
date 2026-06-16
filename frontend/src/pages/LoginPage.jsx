import { useState } from 'react';
import { login } from '../services/api.js';
import Message from '../components/Message.jsx';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@compras.cv');
  const [senha, setSenha] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = await login(email, senha);
      onLogin(data.token);
    } catch (error) {
      setMessage({ tipo: 'erro', texto: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">Tema 3</p>
        <h1>Gestão de Pedidos de Compras</h1>
        <p className="muted">Entre para gerir pedidos de compra, produtos, fornecedores e solicitantes.</p>

        <Message message={message} />

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
