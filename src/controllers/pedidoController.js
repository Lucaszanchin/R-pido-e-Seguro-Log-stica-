const { pedidoModel } = require('../models/pedidoModel');   // Importa o model de pedidos
const { clienteModel } = require('../models/clienteModel'); // Importa o model de clientes

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
      // Desestrutura os dados enviados pelo cliente
      const { id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido } = req.body;

      // Verifica campos obrigatórios
      if (!id_cliente || !data_pedido || !tipoEntrega_pedido || pesoKg_pedido == null || distanciaKm_pedido == null || valorBaseKm_pedido == null || valorBaseKg_pedido == null) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser enviados.' });
      }

      // Verifica se o cliente existe no banco
      const cliente = await clienteModel.selecionarPorId(id_cliente);
      if (!cliente || (Array.isArray(cliente) && cliente.length === 0)) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      // Cria o pedido no banco
      const result = await pedidoModel.criarPedido({ id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido });

      // Retorna sucesso com o ID gerado
      return res.status(201).json({ id_pedido: result.id, message: 'Pedido criado com sucesso.' });

    } catch (error) {
      console.error(error); // Log do erro
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
      const pedidos = await pedidoModel.listarTodosPedidos(); // Busca todos os pedidos
      res.json(pedidos); // Retorna lista para o cliente

    } catch (error) {

      console.log(error); // Exibe o erro no console
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
      const id = Number(req.params.id); // Converte parâmetro para número

      // Verifica ID válido
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      // Busca pedido
      const pedido = await pedidoModel.buscarPorId(id);

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
      }

      return res.json(pedido); // Retorna o pedido

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
      const idPedido = Number(req.params.idPedido); // Converte ID para número

      // Validação do ID
      if (!idPedido) {
        return res.status(400).json({ message: "ID inválido." });
      }

      // Busca o pedido atual
      const pedidoAtual = await pedidoModel.buscarPorId(idPedido);

      if (!pedidoAtual) {
        return res.status(404).json({ message: "Pedido não encontrado." });
      }

      // Pega os novos dados enviados no body
      let { id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido } = req.body;

      // Mantém valores antigos se não forem enviados
      id_cliente = id_cliente ?? pedidoAtual.id_cliente;
      data_pedido = data_pedido ?? pedidoAtual.data_pedido;
      tipoEntrega_pedido = tipoEntrega_pedido ?? pedidoAtual.tipoEntrega_pedido;
      pesoKg_pedido = pesoKg_pedido ?? pedidoAtual.pesoKg_pedido;
      distanciaKm_pedido = distanciaKm_pedido ?? pedidoAtual.distanciaKm_pedido;
      valorBaseKm_pedido = valorBaseKm_pedido ?? pedidoAtual.valorBaseKm_pedido;
      valorBaseKg_pedido = valorBaseKg_pedido ?? pedidoAtual.valorBaseKg_pedido;

      // Atualiza pedido no banco
      const resultado = await pedidoModel.atualizarPedido(idPedido, id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido);

      // Verifica se atualização ocorreu
      if (!resultado || resultado.affectedRows === 0) {
        return res.status(500).json({ message: "Erro ao atualizar pedido." });
      }

      // Retorna sucesso com os novos dados
      res.status(200).json({
        message: "Pedido atualizado com sucesso!", data: { idPedido, id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido}});

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro no servidor." });
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
      const idPedido = Number(req.params.idPedido); // Converte ID

      // Verifica ID válido
      if (isNaN(idPedido) || idPedido <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      // Verifica se existem entregas vinculadas a este pedido
      const qtdEntregas = await pedidoModel.verificarPedidosVinculados(idPedido);

      if (qtdEntregas > 0) {
        return res.status(400).json({
          message: `Não é possível excluir. O pedido possui ${qtdEntregas} entrega vinculada.`,
        });
      }

      // Executa deleção
      const resultado = await pedidoModel.deletarPedido(idPedido);

      // Verifica se o pedido existia
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

module.exports = { pedidoController }; // Exporta o controller
