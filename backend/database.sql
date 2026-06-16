-- Criação da base de dados
CREATE DATABASE gestao_compras;

\c gestao_compras;

-- Tabela de utilizadores
CREATE TABLE utilizadores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  utilizador_id INTEGER REFERENCES utilizadores(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pendente',
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE itens_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INTEGER REFERENCES produtos(id) ON DELETE SET NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario NUMERIC(10, 2) NOT NULL
);

-- Dados iniciais: utilizadores
INSERT INTO utilizadores (nome, email, senha) VALUES
  ('Bruno Tavares', 'bruno@email.com', 'senha123'),
  ('João Silva', 'joao@email.com', 'senha123'),
  ('Aulindo Correia', 'aulindo@email.com', 'senha123'),
  ('Maria Andrade', 'maria@email.com', 'senha123'),
  ('Carlos Pinto', 'carlos@email.com', 'senha123');

-- Dados iniciais: produtos
INSERT INTO produtos (nome, descricao, preco, stock) VALUES
  ('Cadeira de Escritório', 'Cadeira ergonómica ajustável', 250.00, 10),
  ('Monitor 24"', 'Monitor Full HD 24 polegadas', 350.00, 5),
  ('Teclado Mecânico', 'Teclado mecânico RGB', 120.00, 15),
  ('Rato Sem Fios', 'Rato óptico sem fios', 45.00, 20),
  ('Headset USB', 'Headset com microfone para videochamadas', 80.00, 8);

-- Dados iniciais: pedidos
INSERT INTO pedidos (utilizador_id, status, total) VALUES
  (1, 'pendente', 370.00),
  (2, 'aprovado', 120.00),
  (3, 'entregue', 395.00),
  (4, 'pendente', 45.00),
  (5, 'cancelado', 80.00);

-- Dados iniciais: itens dos pedidos
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
  (1, 1, 1, 250.00),
  (1, 4, 1, 45.00),
  (1, 5, 1, 80.00),
  (2, 3, 1, 120.00),
  (3, 2, 1, 350.00),
  (3, 4, 1, 45.00),
  (4, 4, 1, 45.00),
  (5, 5, 1, 80.00);
