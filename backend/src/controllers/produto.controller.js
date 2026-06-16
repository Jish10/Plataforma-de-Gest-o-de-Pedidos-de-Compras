const ProdutoModel = require('../models/produto.model');

async function listarProdutos(req, res, next) {
  try {
    const produtos = await ProdutoModel.listarTodos();
    res.json(produtos);
  } catch (err) { next(err); }
}

async function obterProduto(req, res, next) {
  try {
    const produto = await ProdutoModel.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    res.json(produto);
  } catch (err) { next(err); }
}

async function criarProduto(req, res, next) {
  try {
    const { nome, descricao, preco, stock } = req.body;
    const produto = await ProdutoModel.criar(nome, descricao, preco, stock);
    res.status(201).json(produto);
  } catch (err) { next(err); }
}

async function atualizarProduto(req, res, next) {
  try {
    const { nome, descricao, preco, stock } = req.body;
    const produto = await ProdutoModel.atualizar(req.params.id, nome, descricao, preco, stock);
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    res.json(produto);
  } catch (err) { next(err); }
}

async function removerProduto(req, res, next) {
  try {
    const produto = await ProdutoModel.remover(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    res.json({ mensagem: 'Produto removido com sucesso.' });
  } catch (err) { next(err); }
}

module.exports = { listarProdutos, obterProduto, criarProduto, atualizarProduto, removerProduto };
