import { query } from '../config/db.js';

export async function findUsers() {
  const result = await query(
    `SELECT id, nome, email, departamento
     FROM users
     ORDER BY nome ASC`
  );

  return result.rows;
}

export async function findSuppliers() {
  const result = await query(
    `SELECT id, nome, email, telefone, endereco
     FROM suppliers
     ORDER BY nome ASC`
  );

  return result.rows;
}

export async function findProducts() {
  const result = await query(
    `SELECT p.id,
            p.nome,
            p.descricao,
            p.preco_unitario,
            p.estoque,
            p.supplier_id,
            s.nome AS fornecedor
     FROM products p
     JOIN suppliers s ON s.id = p.supplier_id
     ORDER BY p.nome ASC`
  );

  return result.rows;
}
