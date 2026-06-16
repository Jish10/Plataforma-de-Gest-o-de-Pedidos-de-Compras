const pool = require('../config/db');

async function listarTodos() {
  const resultado = await pool.query(`
    SELECT p.*, u.nome AS utilizador_nome
    FROM pedidos p
    LEFT JOIN utilizadores u ON p.utilizador_id = u.id
    ORDER BY p.criado_em DESC
  `);
  return resultado.rows;
}

async function buscarPorId(id) {
  const pedido = await pool.query(`
    SELECT p.*, u.nome AS utilizador_nome
    FROM pedidos p
    LEFT JOIN utilizadores u ON p.utilizador_id = u.id
    WHERE p.id = $1
  `, [id]);

  const itens = await pool.query(`
    SELECT i.*, pr.nome AS produto_nome
    FROM itens_pedido i
    LEFT JOIN produtos pr ON i.produto_id = pr.id
    WHERE i.pedido_id = $1
  `, [id]);

  if (pedido.rows.length === 0) return null;
  return { ...pedido.rows[0], itens: itens.rows };
}

async function criar(utilizador_id, itens) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    const itensComPreco = [];

    for (const item of itens) {
      const prod = await client.query('SELECT preco FROM produtos WHERE id = $1', [item.produto_id]);
      if (prod.rows.length === 0) throw { status: 404, message: `Produto ${item.produto_id} não encontrado.` };
      const preco = prod.rows[0].preco;
      total += preco * item.quantidade;
      itensComPreco.push({ ...item, preco_unitario: preco });
    }

    const novoPedido = await client.query(
      'INSERT INTO pedidos (utilizador_id, total) VALUES ($1, $2) RETURNING *',
      [utilizador_id, total]
    );
    const pedido_id = novoPedido.rows[0].id;

    for (const item of itensComPreco) {
      await client.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
        [pedido_id, item.produto_id, item.quantidade, item.preco_unitario]
      );
    }

    await client.query('COMMIT');
    return novoPedido.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function atualizar(id, status) {
  const resultado = await pool.query(
    'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return resultado.rows[0];
}

async function remover(id) {
  const resultado = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);
  return resultado.rows[0];
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover };
