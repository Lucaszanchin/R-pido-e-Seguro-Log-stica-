const express = require('express');
const clienteRoutes = express.Router();

const {clienteController} = require('../controllers/clienteController');

// Rotas de Clientes
clienteRoutes.get('/clientes', clienteController.buscarTodosClientes); // Rota para buscar todos clientes
clienteRoutes.get('/clientes/:idCliente', clienteController.buscarClientePorID); // Rota para buscar o cliente pelo ID
clienteRoutes.post('/clientes', clienteController.incluirCliente); // Rota para inserir um cliente
clienteRoutes.put('/clientes/:idCliente', clienteController.atualizarCliente); // Rota para atualizar as informações do cliente
clienteRoutes.delete('/clientes/:idCliente', clienteController.excluindoCliente); // Rota para exluir o cliente

module.exports = {clienteRoutes}; // Exporta como objeto