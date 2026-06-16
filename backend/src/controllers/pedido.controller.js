const PedidoModel = require('../models/pedido.model');

async function listarPedidos(req, res, next) {
  try {
    const pedidos = await PedidoModel.listarTodos();
    res.json(pedidos);
  } catch (err) { next(err); }
}

async function obterPedido(req, res, next) {
  try {
    const pedido = await PedidoModel.buscarPorId(req.params.id);
    if (!pedido) return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    res.json(pedido);
  } catch (err) { next(err); }
}

async function criarPedido(req, res, next) {
  try {
    const { utilizador_id, itens } = req.body;
    const pedido = await PedidoModel.criar(utilizador_id, itens);
    res.status(201).json(pedido);
  } catch (err) { next(err); }
}

async function atualizarPedido(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ mensagem: 'O campo status é obrigatório.' });
    const pedido = await PedidoModel.atualizar(req.params.id, status);
    if (!pedido) return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    res.json(pedido);
  } catch (err) { next(err); }
}

async function removerPedido(req, res, next) {
  try {
    const pedido = await PedidoModel.remover(req.params.id);
    if (!pedido) return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    res.json({ mensagem: 'Pedido removido com sucesso.' });
  } catch (err) { next(err); }
}

module.exports = { listarPedidos, obterPedido, criarPedido, atualizarPedido, removerPedido };
