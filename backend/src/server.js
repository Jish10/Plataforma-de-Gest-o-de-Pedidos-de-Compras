import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import lookupRoutes from './routes/lookup.routes.js';
import purchaseOrderRoutes from './routes/purchaseOrder.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API da Plataforma de Gestão de Pedidos de Compras está online.',
    recurso_principal: '/api/purchase-orders'
  });
});

// Rota pública para autenticação.
app.use('/api/auth', authRoutes);

// A partir daqui, as rotas precisam de Authorization: Bearer <token>.
app.use('/api', authMiddleware);
app.use('/api', lookupRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);

// Rota para caminhos que não existem.
app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

// Middleware centralizado de tratamento de erros.
// A assinatura com 4 parâmetros é obrigatória no Express para erros.
app.use((err, req, res, next) => {
  const status = err.status || 500;

  console.error('Erro capturado pelo middleware centralizado:', err);

  res.status(status).json({
    mensagem: err.message || 'Erro interno no servidor.'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
