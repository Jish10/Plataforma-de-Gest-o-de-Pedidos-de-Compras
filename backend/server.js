require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pedidoRoutes = require('./src/routes/pedido.routes');
const produtoRoutes = require('./src/routes/produto.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/pedidos', pedidoRoutes);
app.use('/api/produtos', produtoRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Gestão de Pedidos de Compras a funcionar.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ mensagem: err.message || 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
