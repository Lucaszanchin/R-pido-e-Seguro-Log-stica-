const { pedidoModel } = require('../models/pedidoModel');
const { clienteModel } = require('../models/clienteModel');

const pedidoController = {
  async inserirNovoPedido(req, res) {
    try {
      const {id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valoBaseKm_pedido, valorBaseKg_pedido} = req.body;

      
      if (!id_cliente || !data_pedido || !tipoEntrega_pedido || pesoKg_pedido == null || distanciaKm_pedido == null || valoBaseKm_pedido == null || valorBaseKg_pedido == null) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser enviados.' });
      }

      
      const cliente = await clienteModel.buscarPorId(id_cliente);
      if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' });

      const result = await pedidoModel.criarPedido({id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valoBaseKm_pedido, valorBaseKg_pedido});

      return res.status(201).json({ id_pedido: result.id, message: 'Pedido criado.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar pedido.' });
    }
  },

  async listarTodosPedidos(req, res) {
    try {
      const pedidos = await pedidoModel.listarTodos();
      return res.json(pedidos);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao listar pedidos.' });
    }
  },

  async buscarPedidoPorId(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) return res.status(400).json({ message: 'ID inválido.' });

      const pedido = await pedidoModel.buscarPorId(id);
      if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado.' });
      return res.json(pedido);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar pedido.' });
    }
  }
};

module.exports = { pedidoController };
