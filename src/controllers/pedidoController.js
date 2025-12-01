const { pedidoModel } = require('../models/pedidoModel');
const { clienteModel } = require('../models/clienteModel');

const pedidoController = {

  /**
   * Insere um novo pedido no banco de dados.
   * Rota: POST /pedidos
   * 
   * @async
   * @function inserirNovoPedido
   * @param {Request} req Objeto da requisição HTTP contendo os dados do pedido.
   * @param {Response} res Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna mensagem de sucesso ou erro.
   */
  async inserirNovoPedido(req, res) {
    try {
      const { id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido } = req.body;

      if (!id_cliente || !data_pedido || !tipoEntrega_pedido || pesoKg_pedido == null || distanciaKm_pedido == null || valorBaseKm_pedido == null || valorBaseKg_pedido == null) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser enviados.' });
      }

      const cliente = await clienteModel.selecionarPorId(id_cliente);
      if (!cliente || (Array.isArray(cliente) && cliente.length === 0)) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      const result = await pedidoModel.criarPedido({ id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido });

      return res.status(201).json({ id_pedido: result.id, message: 'Pedido criado com sucesso.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar pedido.', errorMessage: error.message });
    }
  },

  /**
   * Lista todos os pedidos usando o método listarTodosPedidos() do model.
   * (Versão mais recente do método)
   * 
   * @async
   * @function listarTodosPedidos
   * @param {Request} req Objeto da requisição HTTP.
   * @param {Response} res Objeto da resposta HTTP.
   * @returns {Promise<Response>} Lista de pedidos.
   */
  listarTodosPedidos: async (req, res) => {
    try {
      const pedidos = await pedidoModel.listarTodosPedidos();
      res.json(pedidos);

    } catch (error) {

      console.log(error);
      res.status(500).json({ message: "Erro ao buscar pedidos.", errorMessage: error.message });
    }

  },

  /**
   * Busca um pedido específico pelo ID.
   * Rota: GET /pedidos/:id
   * 
   * @async
   * @function buscarPedidoPorId
   * @param {Request} req Objeto da requisição com parâmetro de ID.
   * @param {Response} res Resposta HTTP.
   * @returns {Promise<Response>} Retorna o pedido ou erro.
   */
  async buscarPedidoPorId(req, res) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const pedido = await pedidoModel.buscarPorId(id);
      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
      }

      return res.json(pedido);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar pedido.' });
    }
  },

  /**
   * Atualiza um pedido existente.
   * Rota: PUT /pedidos/:idPedido
   * 
   * @async
   * @function atualizarPedido
   * @param {Request} req Requisição contendo ID e dados do pedido.
   * @param {Response} res Resposta HTTP.
   * @returns {Promise<Response>} Mensagem de sucesso ou erro.
   */
  async atualizarPedido(req, res) {
    try {
      const idPedido = Number(req.params.idPedido);

      if (!idPedido) {
        return res.status(400).json({ message: "ID inválido." });
      }

      const pedidoAtual = await pedidoModel.buscarPorId(idPedido);

      if (!pedidoAtual) {
        return res.status(404).json({ message: "Pedido não encontrado." });
      }

      let { id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido } = req.body;

      id_cliente = id_cliente ?? pedidoAtual.id_cliente;
      data_pedido = data_pedido ?? pedidoAtual.data_pedido;
      tipoEntrega_pedido = tipoEntrega_pedido ?? pedidoAtual.tipoEntrega_pedido;
      pesoKg_pedido = pesoKg_pedido ?? pedidoAtual.pesoKg_pedido;
      distanciaKm_pedido = distanciaKm_pedido ?? pedidoAtual.distanciaKm_pedido;
      valorBaseKm_pedido = valorBaseKm_pedido ?? pedidoAtual.valorBaseKm_pedido;
      valorBaseKg_pedido = valorBaseKg_pedido ?? pedidoAtual.valorBaseKg_pedido;

      const resultado = await pedidoModel.atualizarPedido(idPedido, id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido);

      if (!resultado || resultado.affectedRows === 0) {
        return res.status(500).json({ message: "Erro ao atualizar pedido." });
      }

      res.status(200).json({
        message: "Pedido atualizado com sucesso!", data: { idPedido, id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido }
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro no servidor.", });
    }
  },

  /**
   * Deleta um pedido pelo ID.
   * Rota: DELETE /pedidos/:idPedido
   * 
   * @async
   * @function deletarPedido
   * @param {Request} req Requisição contendo ID do pedido.
   * @param {Response} res Resposta HTTP.
   * @returns {Promise<Response>} Mensagem de sucesso ou erro.
   */
  async deletarPedido(req, res) {
    try {
      const idPedido = Number(req.params.idPedido);

      if (isNaN(idPedido) || idPedido <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const resultado = await pedidoModel.deletarPedido(idPedido);

      if (!resultado || resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
      }

      return res.json({ message: 'Pedido deletado com sucesso.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar pedido.', errorMessage: error.message });
    }
  }
};

module.exports = { pedidoController };
