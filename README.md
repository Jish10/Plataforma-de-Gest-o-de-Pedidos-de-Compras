# Plataforma de Gestão de Pedidos de Compras

Trabalho Prático 2 – Desenvolvimento Web (PERN Stack)  
Universidade do Mindelo – Tema 3  
Grupo: Bruno, João, Aulindo

---

## Tecnologias

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React (Vite)

---

## Estrutura do Projeto

```
projeto-compras/
├── backend/
│   ├── server.js
│   ├── database.sql
│   ├── .env.example
│   └── src/
│       ├── config/db.js
│       ├── controllers/
│       │   ├── pedido.controller.js
│       │   └── produto.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── validation.middleware.js
│       ├── models/
│       │   ├── pedido.model.js
│       │   └── produto.model.js
│       └── routes/
│           ├── pedido.routes.js
│           └── produto.routes.js
└── frontend/
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── PedidoForm.jsx
        │   ├── PedidoLista.jsx
        │   └── ProdutoLista.jsx
        └── pages/
            ├── PedidosPage.jsx
            └── ProdutosPage.jsx
```

---

## Instalação e Execução

### 1. Base de dados

```bash
psql -U postgres
\i backend/database.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Editar .env com as credenciais do PostgreSQL
npm install
npm run dev
```

O servidor fica disponível em: `http://localhost:3001`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend fica disponível em: `http://localhost:5173`

---

## Token de Autenticação

Todas as rotas requerem o header:

```
Authorization: Bearer meu-token-secreto-2025
```

---

## Rotas da API

### Pedidos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/pedidos | Listar todos |
| GET | /api/pedidos/:id | Obter um pedido |
| POST | /api/pedidos | Criar pedido |
| PUT | /api/pedidos/:id | Atualizar status |
| DELETE | /api/pedidos/:id | Remover pedido |

### Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/produtos | Listar todos |
| GET | /api/produtos/:id | Obter um produto |
| POST | /api/produtos | Criar produto |
| PUT | /api/produtos/:id | Atualizar produto |
| DELETE | /api/produtos/:id | Remover produto |

---

## Exemplos cURL

```bash
# Listar pedidos
curl -H "Authorization: Bearer meu-token-secreto-2025" http://localhost:3001/api/pedidos

# Criar pedido
curl -X POST http://localhost:3001/api/pedidos \
  -H "Authorization: Bearer meu-token-secreto-2025" \
  -H "Content-Type: application/json" \
  -d '{"utilizador_id": 1, "itens": [{"produto_id": 1, "quantidade": 2}]}'

# Atualizar status
curl -X PUT http://localhost:3001/api/pedidos/1 \
  -H "Authorization: Bearer meu-token-secreto-2025" \
  -H "Content-Type: application/json" \
  -d '{"status": "aprovado"}'

# Remover pedido
curl -X DELETE http://localhost:3001/api/pedidos/1 \
  -H "Authorization: Bearer meu-token-secreto-2025"

# Criar produto
curl -X POST http://localhost:3001/api/produtos \
  -H "Authorization: Bearer meu-token-secreto-2025" \
  -H "Content-Type: application/json" \
  -d '{"nome": "Impressora", "descricao": "Impressora a laser", "preco": 450, "stock": 3}'
```

---

## Diagrama ER

```
utilizadores          produtos
-----------           --------
id (PK)               id (PK)
nome                  nome
email                 descricao
senha                 preco
criado_em             stock
    |                 criado_em
    |                     |
    |      pedidos         |
    |      -------         |
    +----> id (PK)         |
           utilizador_id   |
           status          |
           total           |
           criado_em       |
               |           |
               |  itens_pedido
               |  -----------
               +-> pedido_id (FK)
                   produto_id (FK) <--+
                   quantidade
                   preco_unitario
```
