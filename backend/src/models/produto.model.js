const pool = require('../config/db');

async function listarTodos() {
  const resultado = await pool.query('SELECT * FROM produtos ORDER BY nome');
  return resultado.rows;
}

async function buscarPorId(id) {
  const resultado = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
  return resultado.rows[0] || null;
}

async function criar(nome, descricao, preco, stock) {
  const resultado = await pool.query(
    'INSERT INTO produtos (nome, descricao, preco, stock) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, descricao || '', preco, stock || 0]
  );
  return resultado.rows[0];
}

async function atualizar(id, nome, descricao, preco, stock) {
  const resultado = await pool.query(
    'UPDATE produtos SET nome=$1, descricao=$2, preco=$3, stock=$4 WHERE id=$5 RETURNING *',
    [nome, descricao || '', preco, stock || 0, id]
  );
  return resultado.rows[0];
}

async function remover(id) {
  const resultado = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
  return resultado.rows[0];
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover };
