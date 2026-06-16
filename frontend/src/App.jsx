import { useState } from 'react';
import Header from './components/Header.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  function handleLogin(novoToken) {
    localStorage.setItem('token', novoToken);
    setToken(novoToken);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken('');
  }

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <Header onLogout={handleLogout} />
      <PurchaseOrdersPage />
    </>
  );
}

export default App;
