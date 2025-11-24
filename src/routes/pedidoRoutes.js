const express = require('express');
const router = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

router.post('/', pedidoController.inserirNovoPedido);
router.get('/', pedidoController.listarTodosPedidos);
router.get('/:id', pedidoController.buscarPedidoPorId);

module.exports = { pedidoRoutes: router };
