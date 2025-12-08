const express = require('express');
const entregaRoutes = express.Router();

const { entregaController } = require('../controllers/entregaController');

// Rotas de entrega
entregaRoutes.get('/entregas', entregaController.listarEntregas); // Rota para listar todas entregas
entregaRoutes.get('/entregas/:id', entregaController.buscarEntregaPorId); // Rota para listar entrega por ID
entregaRoutes.get('/clientes/:id/entregas', entregaController.listarEntregasDoCliente); // Rota para listar as entregas relacionadas ao ID do cliente
entregaRoutes.get('/entregas/pedido/:id_pedido', entregaController.buscarPorPedido); // Rota para buscar entrega por ID do pedido
entregaRoutes.post('/entregas/calcular', entregaController.calcularERegistrar); // Rota para calcular e registrar entrega
entregaRoutes.put('/entregas/:id', entregaController.atualizarEntrega); // Rota para atualizar entrega
entregaRoutes.put('/entregas2/:id', entregaController.atualizarStatus); // Rota para atulizar status
entregaRoutes.delete('/entregas/:id', entregaController.deletarEntrega); // Rota para deletar entregas

module.exports = { entregaRoutes }; // Exporta como objeto
