-- Plataforma de Gestão de Pedidos de Compras
-- Tema 3 - Trabalho Prático Nº 2
-- Este script cria a base de dados lógica da aplicação e insere dados iniciais.

DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    departamento VARCHAR(80) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    endereco VARCHAR(180) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    preco_unitario NUMERIC(12, 2) NOT NULL CHECK (preco_unitario > 0),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    data_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT status_pedido_valido CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'recebido'))
);

CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(12, 2) NOT NULL CHECK (preco_unitario > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT produto_unico_por_pedido UNIQUE (purchase_order_id, product_id)
);

-- Utilizadores iniciais
INSERT INTO users (nome, email, departamento) VALUES
('João Melício', 'joao.melicio@compras.cv', 'Informática'),
('Bruno Andrade', 'bruno.andrade@compras.cv', 'Administração'),
('Aulindo Silva', 'aulindo.silva@compras.cv', 'Logística'),
('Carla Gomes', 'carla.gomes@compras.cv', 'Recursos Humanos'),
('Rui Lopes', 'rui.lopes@compras.cv', 'Financeiro');

-- Fornecedores iniciais
INSERT INTO suppliers (nome, email, telefone, endereco) VALUES
('Tech Cabo Verde', 'vendas@techcv.cv', '+238 231 1000', 'Mindelo, São Vicente'),
('Papelaria Central', 'comercial@papelariacentral.cv', '+238 261 2000', 'Praia, Santiago'),
('Office Pro CV', 'geral@officepro.cv', '+238 232 3000', 'Mindelo, São Vicente'),
('Digital Store', 'contacto@digitalstore.cv', '+238 262 4000', 'Praia, Santiago'),
('Global Supplies', 'info@globalsupplies.cv', '+238 235 5000', 'Sal, Cabo Verde');

-- Produtos iniciais
INSERT INTO products (nome, descricao, preco_unitario, estoque, supplier_id) VALUES
('Computador Portátil', 'Portátil para trabalho administrativo e académico.', 68000.00, 12, 1),
('Monitor 24 polegadas', 'Monitor LED Full HD para escritório.', 18000.00, 20, 1),
('Resma de Papel A4', 'Papel A4 branco para impressão.', 750.00, 150, 2),
('Cadeira Ergonómica', 'Cadeira de escritório com apoio lombar.', 24500.00, 10, 3),
('Teclado e Rato Wireless', 'Conjunto sem fios para computador.', 4200.00, 35, 4),
('Projetor Multimédia', 'Projetor para salas de reunião e apresentação.', 56000.00, 5, 5);

-- Pedidos iniciais
INSERT INTO purchase_orders (user_id, supplier_id, data_pedido, status, observacoes) VALUES
(1, 1, '2026-06-01', 'pendente', 'Pedido para melhorar o laboratório de informática.'),
(2, 2, '2026-06-02', 'aprovado', 'Materiais para secretaria.'),
(3, 3, '2026-06-03', 'pendente', 'Mobiliário para equipa de logística.'),
(4, 4, '2026-06-04', 'recebido', 'Periféricos já entregues.'),
(5, 5, '2026-06-05', 'rejeitado', 'Pedido rejeitado por falta de orçamento.');

-- Itens iniciais
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantidade, preco_unitario) VALUES
(1, 1, 2, 68000.00),
(1, 2, 3, 18000.00),
(2, 3, 10, 750.00),
(3, 4, 2, 24500.00),
(4, 5, 5, 4200.00),
(5, 6, 1, 56000.00);

-- Consulta útil para verificar os pedidos com total
SELECT
    po.id,
    u.nome AS solicitante,
    s.nome AS fornecedor,
    po.data_pedido,
    po.status,
    COALESCE(SUM(poi.quantidade * poi.preco_unitario), 0) AS total
FROM purchase_orders po
JOIN users u ON u.id = po.user_id
JOIN suppliers s ON s.id = po.supplier_id
LEFT JOIN purchase_order_items poi ON poi.purchase_order_id = po.id
GROUP BY po.id, u.nome, s.nome
ORDER BY po.id;
