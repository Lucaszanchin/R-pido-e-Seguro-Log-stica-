const express = require('express');
const entregaRoutes = express.Router();

const { entregaController } = require('../controllers/entregaController');

// Rotas de entrega
entregaRoutes.get('/entregas', entregaController.listarEntregas);
entregaRoutes.get('/entregas/pedido/:id_pedido', entregaController.buscarPorPedido);
entregaRoutes.post('/entregas/calcular', entregaController.calcularERegistrar); // calcula e registra entrega
entregaRoutes.put('/entregas/:id', entregaController.atualizarStatus);
entregaRoutes.delete('/entregas/:id', entregaController.deletarEntrega)

module.exports = { entregaRoutes }; // Exporta como objeto
