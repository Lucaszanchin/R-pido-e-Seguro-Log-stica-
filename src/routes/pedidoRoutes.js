const express = require('express');
const pedidoRoutes = express.Router();

const { pedidoController } = require('../controllers/pedidoController');

// Rotas de pedido
pedidoRoutes.get('/pedidos', pedidoController.listarTodosPedidos); // Rota para listar todos pedidos
pedidoRoutes.get('/pedidos/:id', pedidoController.buscarPedidoPorId); // Rota para buscar pedido por ID
pedidoRoutes.post('/pedidos', pedidoController.inserirNovoPedido); // Rota para inserir novo pedido
pedidoRoutes.put('/pedidos/:idPedido', pedidoController.atualizarPedido); //Rota para atualizar as informações dos pedidos
pedidoRoutes.delete('/pedidos/:idPedido', pedidoController.deletarPedido); // Rota para deletar os pedidos

module.exports = { pedidoRoutes }; // Exporta como objeto
