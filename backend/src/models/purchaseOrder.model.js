import { query, getClient } from '../config/db.js';
import { createHttpError } from '../utils/httpError.js';

function mapOrder(row, items = []) {
  return {
    ...row,
    total: Number(row.total || 0),
    itens: items
  };
}

async function findOrderHeader(id, client = null) {
  const executor = client || { query };

  const result = await executor.query(
    `SELECT po.id,
            po.user_id,
            u.nome AS solicitante,
            po.supplier_id,
            s.nome AS fornecedor,
            po.data_pedido,
            po.status,
            po.observacoes,
            po.created_at,
            po.updated_at,
            COALESCE(SUM(poi.quantidade * poi.preco_unitario), 0) AS total,
            COUNT(poi.id)::int AS total_itens
     FROM purchase_orders po
     JOIN users u ON u.id = po.user_id
     JOIN suppliers s ON s.id = po.supplier_id
     LEFT JOIN purchase_order_items poi ON poi.purchase_order_id = po.id
     WHERE po.id = $1
     GROUP BY po.id, u.nome, s.nome`,
    [id]
  );

  return result.rows[0];
}

async function findOrderItems(id, client = null) {
  const executor = client || { query };

  const result = await executor.query(
    `SELECT poi.id,
            poi.product_id,
            p.nome AS produto,
            poi.quantidade,
            poi.preco_unitario,
            (poi.quantidade * poi.preco_unitario) AS subtotal
     FROM purchase_order_items poi
     JOIN products p ON p.id = poi.product_id
     WHERE poi.purchase_order_id = $1
     ORDER BY poi.id ASC`,
    [id]
  );

  return result.rows.map((item) => ({
    ...item,
    quantidade: Number(item.quantidade),
    preco_unitario: Number(item.preco_unitario),
    subtotal: Number(item.subtotal)
  }));
}

async function prepararItens(client, supplierId, itens) {
  const itensPreparados = [];

  for (const item of itens) {
    const produtoResult = await client.query(
      `SELECT id, nome, preco_unitario, supplier_id
       FROM products
       WHERE id = $1`,
      [item.product_id]
    );

    const produto = produtoResult.rows[0];

    if (!produto) {
      throw createHttpError(404, `Produto com id ${item.product_id} não encontrado.`);
    }

    if (Number(produto.supplier_id) !== Number(supplierId)) {
      throw createHttpError(
        400,
        `O produto "${produto.nome}" pertence a outro fornecedor. Escolha produtos do fornecedor selecionado.`
      );
    }

    itensPreparados.push({
      product_id: Number(item.product_id),
      quantidade: Number(item.quantidade),
      preco_unitario: item.preco_unitario ? Number(item.preco_unitario) : Number(produto.preco_unitario)
    });
  }

  return itensPreparados;
}

export async function findAll() {
  const result = await query(
    `SELECT po.id,
            po.user_id,
            u.nome AS solicitante,
            po.supplier_id,
            s.nome AS fornecedor,
            po.data_pedido,
            po.status,
            po.observacoes,
            po.created_at,
            po.updated_at,
            COALESCE(SUM(poi.quantidade * poi.preco_unitario), 0) AS total,
            COUNT(poi.id)::int AS total_itens
     FROM purchase_orders po
     JOIN users u ON u.id = po.user_id
     JOIN suppliers s ON s.id = po.supplier_id
     LEFT JOIN purchase_order_items poi ON poi.purchase_order_id = po.id
     GROUP BY po.id, u.nome, s.nome
     ORDER BY po.id DESC`
  );

  return result.rows.map((row) => ({ ...row, total: Number(row.total || 0) }));
}

export async function findById(id) {
  const order = await findOrderHeader(id);

  if (!order) {
    return null;
  }

  const items = await findOrderItems(id);
  return mapOrder(order, items);
}

export async function create(data) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const itensPreparados = await prepararItens(client, data.supplier_id, data.itens);

    const orderResult = await client.query(
      `INSERT INTO purchase_orders (user_id, supplier_id, data_pedido, status, observacoes)
       VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE), $4, $5)
       RETURNING id`,
      [
        data.user_id,
        data.supplier_id,
        data.data_pedido || null,
        data.status || 'pendente',
        data.observacoes || null
      ]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of itensPreparados) {
      await client.query(
        `INSERT INTO purchase_order_items (purchase_order_id, product_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantidade, item.preco_unitario]
      );
    }

    await client.query('COMMIT');

    return findById(orderId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function update(id, data) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const existe = await client.query('SELECT id FROM purchase_orders WHERE id = $1', [id]);

    if (existe.rowCount === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const itensPreparados = await prepararItens(client, data.supplier_id, data.itens);

    await client.query(
      `UPDATE purchase_orders
       SET user_id = $1,
           supplier_id = $2,
           data_pedido = COALESCE($3::date, data_pedido),
           status = $4,
           observacoes = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [
        data.user_id,
        data.supplier_id,
        data.data_pedido || null,
        data.status || 'pendente',
        data.observacoes || null,
        id
      ]
    );

    // Para simplificar a edição, removemos os itens antigos e inserimos os novos.
    await client.query('DELETE FROM purchase_order_items WHERE purchase_order_id = $1', [id]);

    for (const item of itensPreparados) {
      await client.query(
        `INSERT INTO purchase_order_items (purchase_order_id, product_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [id, item.product_id, item.quantidade, item.preco_unitario]
      );
    }

    await client.query('COMMIT');

    return findById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function remove(id) {
  const result = await query(
    `DELETE FROM purchase_orders
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rowCount > 0;
}
