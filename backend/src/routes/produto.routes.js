const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { validarProduto } = require('../middleware/validation.middleware');
const controller = require('../controllers/produto.controller');

router.get('/', auth, controller.listarProdutos);
router.get('/:id', auth, controller.obterProduto);
router.post('/', auth, validarProduto, controller.criarProduto);
router.put('/:id', auth, validarProduto, controller.atualizarProduto);
router.delete('/:id', auth, controller.removerProduto);

module.exports = router;
