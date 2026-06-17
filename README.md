# Plataforma de Gestão de Pedidos de Compras — Tema 3

Projeto fullstack desenvolvido para o **Trabalho Prático Nº 2 de Desenvolvimento Web**.

O sistema permite gerir pedidos de compras de produtos, com autenticação básica, rotas CRUD, validação de dados, tratamento centralizado de erros, PostgreSQL no backend e React no frontend.

## Grupo

- Bruno
- João
- Aulindo

## Tema escolhido

**Tema 3 – Plataforma de Gestão de Pedidos de Compras**

Objetivo: criar um sistema para gerir pedidos de compras de produtos.

---

## Tecnologias utilizadas

### Backend

- Node.js
- Express
- PostgreSQL
- node-postgres (`pg`)
- CORS
- Dotenv
- Nodemon

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

---

## Estrutura do projeto

```txt
plataforma-gestao-pedidos-compras/
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── lookup.controller.js
│       │   └── purchaseOrder.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── validation.middleware.js
│       ├── models/
│       │   ├── lookup.model.js
│       │   └── purchaseOrder.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── lookup.routes.js
│       │   └── purchaseOrder.routes.js
│       └── utils/
│           └── httpError.js
├── frontend/
│   ├── package.json
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles.css
│       ├── services/
│       │   └── api.js
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   └── PurchaseOrdersPage.jsx
│       └── components/
│           ├── Header.jsx
│           ├── Loading.jsx
│           ├── Message.jsx
│           ├── OrderForm.jsx
│           └── OrderList.jsx
└── database/
    ├── schema.sql
    ├── er_diagram.mmd
    ├── er_diagram.dbml
    └── er_diagram.svg
```

---

## Modelação da base de dados

A base de dados foi modelada com 5 tabelas principais:

1. **users** — pessoas que fazem pedidos de compra.
2. **suppliers** — fornecedores dos produtos.
3. **products** — produtos disponíveis para compra.
4. **purchase_orders** — pedidos de compras.
5. **purchase_order_items** — itens de cada pedido.

### Relacionamentos

- Um utilizador pode criar vários pedidos.
- Um fornecedor pode ter vários produtos.
- Um fornecedor pode receber vários pedidos.
- Um pedido pode ter vários itens.
- Cada item pertence a um produto.

### Diagrama ER

O diagrama também está disponível nos ficheiros:

- `database/er_diagram.svg`
- `database/er_diagram.mmd`
- `database/er_diagram.dbml`

```mermaid
erDiagram
    users ||--o{ purchase_orders : cria
    suppliers ||--o{ products : fornece
    suppliers ||--o{ purchase_orders : recebe
    purchase_orders ||--o{ purchase_order_items : contem
    products ||--o{ purchase_order_items : aparece_em

    users {
        int id PK
        string nome
        string email
        string departamento
        timestamp created_at
    }

    suppliers {
        int id PK
        string nome
        string email
        string telefone
        string endereco
        timestamp created_at
    }

    products {
        int id PK
        string nome
        string descricao
        decimal preco_unitario
        int estoque
        int supplier_id FK
        timestamp created_at
    }

    purchase_orders {
        int id PK
        int user_id FK
        int supplier_id FK
        date data_pedido
        string status
        text observacoes
        timestamp created_at
        timestamp updated_at
    }

    purchase_order_items {
        int id PK
        int purchase_order_id FK
        int product_id FK
        int quantidade
        decimal preco_unitario
        timestamp created_at
    }
```

---

## Como criar a base de dados

### 1. Entrar no PostgreSQL

```bash
psql -U postgres
```

### 2. Criar a base de dados

```sql
CREATE DATABASE compras_db;
```

### 3. Sair do psql

```sql
\q
```

### 4. Executar o script SQL

Na raiz do projeto:

```bash
psql -U postgres -d compras_db -f database/schema.sql
```

O script cria as tabelas, chaves primárias, chaves estrangeiras, regras de validação e insere pelo menos 5 registros iniciais em cada tabela.

---

## Configuração do backend

### 1. Entrar na pasta do backend

```bash
cd backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar o ficheiro `.env`

Copie o exemplo:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=compras_db
DB_USER=postgres
DB_PASSWORD=postgres
AUTH_EMAIL=admin@compras.cv
AUTH_PASSWORD=123456
AUTH_TOKEN=grupo3-token-secreto
```

Altere `DB_USER` e `DB_PASSWORD` conforme a configuração do seu PostgreSQL.

### 4. Executar o backend

```bash
npm run dev
```

O backend ficará disponível em:

```txt
http://localhost:3001
```

Endereço base da API:

```txt
http://localhost:3001/api
```

---

## Configuração do frontend

### 1. Entrar na pasta do frontend

Em outro terminal:

```bash
cd frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar o ficheiro `.env`

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Executar o frontend

```bash
npm run dev
```

O frontend ficará disponível normalmente em:

```txt
http://localhost:5173
```

---

## Autenticação

As rotas principais são protegidas por Bearer Token.

### Credenciais para login

```txt
Email: admin@compras.cv
Senha: 123456
```

### Token para testar no Postman

```txt
grupo3-token-secreto
```

### Header obrigatório nas rotas protegidas

```txt
Authorization: Bearer grupo3-token-secreto
```

---

## Rotas da API

### Autenticação

| Método | Rota                | Descrição                 |
| ------- | ------------------- | --------------------------- |
| POST    | `/api/auth/login` | Faz login e retorna o token |

### Pedidos de compra

| Método | Rota                         | Descrição                  |
| ------- | ---------------------------- | ---------------------------- |
| GET     | `/api/purchase-orders`     | Lista todos os pedidos       |
| GET     | `/api/purchase-orders/:id` | Lista um pedido específico  |
| POST    | `/api/purchase-orders`     | Cria um novo pedido          |
| PUT     | `/api/purchase-orders/:id` | Atualiza um pedido existente |
| DELETE  | `/api/purchase-orders/:id` | Apaga um pedido              |

### Dados auxiliares para o frontend

| Método | Rota               | Descrição        |
| ------- | ------------------ | ------------------ |
| GET     | `/api/users`     | Lista utilizadores |
| GET     | `/api/suppliers` | Lista fornecedores |
| GET     | `/api/products`  | Lista produtos     |

---

## Exemplos de requisições com cURL

### 1. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@compras.cv","senha":"123456"}'
```

Resposta esperada:

```json
{
  "mensagem": "Login realizado com sucesso.",
  "token": "grupo3-token-secreto"
}
```

### 2. Listar pedidos

```bash
curl http://localhost:3001/api/purchase-orders \
  -H "Authorization: Bearer grupo3-token-secreto"
```

### 3. Criar pedido

```bash
curl -X POST http://localhost:3001/api/purchase-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer grupo3-token-secreto" \
  -d '{
    "user_id": 1,
    "supplier_id": 1,
    "data_pedido": "2026-06-10",
    "status": "pendente",
    "observacoes": "Pedido criado via cURL.",
    "itens": [
      {
        "product_id": 1,
        "quantidade": 2,
        "preco_unitario": 18000
      }
    ]
  }'
```

### 4. Ver um pedido específico

```bash
curl http://localhost:3001/api/purchase-orders/1 \
  -H "Authorization: Bearer grupo3-token-secreto"
```

### 5. Atualizar pedido

```bash
curl -X PUT http://localhost:3001/api/purchase-orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer grupo3-token-secreto" \
  -d '{
    "user_id": 1,
    "supplier_id": 1,
    "data_pedido": "2026-06-11",
    "status": "aprovado",
    "observacoes": "Pedido atualizado.",
    "itens": [
      {
        "product_id": 1,
        "quantidade": 3,
        "preco_unitario": 18000
      }
    ]
  }'
```

### 6. Apagar pedido

```bash
curl -X DELETE http://localhost:3001/api/purchase-orders/1 \
  -H "Authorization: Bearer grupo3-token-secreto"
```

---

## Validações implementadas

O middleware `src/middleware/validation.middleware.js` verifica:

- Campos obrigatórios.
- Se `user_id` e `supplier_id` são números válidos.
- Se existe pelo menos um item no pedido.
- Se cada item tem `product_id` válido.
- Se a quantidade é maior que zero.
- Se o preço unitário, quando informado, é maior que zero.
- Se o status está dentro dos valores permitidos:
  - `pendente`
  - `aprovado`
  - `rejeitado`
  - `recebido`
- Regra de negócio: um pedido com data futura não pode estar com status `recebido`.

Além disso, o model verifica uma regra dependente da base de dados:

- O produto escolhido deve pertencer ao fornecedor selecionado no pedido.

---

## Tratamento de erros

O backend possui um middleware centralizado no final do `server.js`:

```js
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error(err);
  res.status(status).json({ mensagem: err.message || 'Erro interno no servidor.' });
});
```

Assim, erros lançados nos controllers e models são tratados no mesmo formato.

---

## Como testar no Postman

1. Faça uma requisição `POST` para `/api/auth/login`.
2. Copie o token retornado.
3. Nas rotas privadas, vá em **Authorization**.
4. Escolha o tipo **Bearer Token**.
5. Cole o token `grupo3-token-secreto`.
6. Teste as rotas GET, POST, PUT e DELETE.

---

## Como usar o sistema no navegador

1. Inicie o PostgreSQL.
2. Crie a base de dados e execute `database/schema.sql`.
3. Inicie o backend com `npm run dev` dentro da pasta `backend`.
4. Inicie o frontend com `npm run dev` dentro da pasta `frontend`.
5. Abra `http://localhost:5173`.
6. Faça login com:
   - Email: `admin@compras.cv`
   - Senha: `123456`
7. Crie, edite, liste e apague pedidos de compra.

---

## Observações importantes

- O backend usa controllers separados das rotas.
- O backend usa models para aceder ao PostgreSQL.
- A autenticação é simples, por token fixo, porque o objetivo do trabalho pede autenticação básica.
- O frontend utiliza `useState`, `useEffect`, `fetch` e `try/catch`.
- O projeto foi organizado para ser fácil de apresentar e explicar em sala.
