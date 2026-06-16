function validarPedido(req, res, next) {
  const { utilizador_id, itens } = req.body;

  if (!utilizador_id) {
    return res.status(400).json({ mensagem: 'O campo utilizador_id é obrigatório.' });
  }

  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ mensagem: 'O pedido deve ter pelo menos um item.' });
  }

  for (const item of itens) {
    if (!item.produto_id || !item.quantidade || item.quantidade < 1) {
      return res.status(400).json({ mensagem: 'Cada item precisa de produto_id e quantidade válida.' });
    }
  }

  next();
}

function validarProduto(req, res, next) {
  const { nome, preco } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' });
  }

  if (preco === undefined || isNaN(preco) || Number(preco) < 0) {
    return res.status(400).json({ mensagem: 'O campo preco deve ser um número positivo.' });
  }

  next();
}

module.exports = { validarPedido, validarProduto };
