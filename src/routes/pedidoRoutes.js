const express = require('express');
const pedidoRoutes = express.Router();

const { pedidoController } = require('../controllers/pedidoController');

// Rotas de pedido
pedidoRoutes.get('/pedidos', pedidoController.listarTodosPedidos);
pedidoRoutes.get('/pedidos/:idPedido', pedidoController.buscarPedidoPorId);
pedidoRoutes.post('/pedidos', pedidoController.inserirNovoPedido);
pedidoRoutes.put('/pedidos/:idPedido', pedidoController.atualizarPedido);
pedidoRoutes.delete('/pedidos/:idPedido', pedidoController.deletarPedido);

module.exports = { pedidoRoutes }; // exporta como objeto
