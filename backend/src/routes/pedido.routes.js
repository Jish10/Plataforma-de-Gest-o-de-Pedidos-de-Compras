const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { validarPedido } = require('../middleware/validation.middleware');
const controller = require('../controllers/pedido.controller');

router.get('/', auth, controller.listarPedidos);
router.get('/:id', auth, controller.obterPedido);
router.post('/', auth, validarPedido, controller.criarPedido);
router.put('/:id', auth, controller.atualizarPedido);
router.delete('/:id', auth, controller.removerPedido);

module.exports = router;
