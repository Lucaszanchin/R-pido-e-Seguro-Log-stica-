const { entregaModel } = require('../models/entregaModel');
const { pedidoModel } = require('../models/pedidoModel');

/**
 * Controlador responsável por operações relacionadas às entregas,
 * incluindo cálculo, listagem, busca, atualização de status e exclusão.
 * @namespace entregaController
 */
const entregaController = {

  /**
   * Calcula o valor de uma entrega com base nos dados do pedido
   * e registra no banco de dados.
   * 
   * Rota: POST /entregas/calcular
   *
   * @async
   * @function calcularERegistrar
   * @param {Request} req Requisição HTTP contendo id_pedido.
   * @param {Response} res Resposta HTTP.
   * @returns {Promise<void>}
   */
  async calcularERegistrar(req, res) {
    try {
      const { id_pedido } = req.body;

      if (!id_pedido)
        return res.status(400).json({ message: 'id pedido é obrigatório.' });

      const pedido = await pedidoModel.buscarPorId(id_pedido);
      if (!pedido)
        return res.status(404).json({ message: 'Pedido não encontrado.' });

      // Cálculos
      const valorDistancia = Number(pedido.distanciaKm_pedido) * Number(pedido.valorBaseKm_pedido);
      const valorPeso = Number(pedido.pesoKg_pedido) * Number(pedido.valorBaseKg_pedido);
      const valorBase = valorDistancia + valorPeso;

      let acrescimo = 0;
      if (pedido.tipoEntrega_pedido === 'urgente') {
        acrescimo = Number((valorBase * 0.20).toFixed(2));
      }

      let valorFinal = Number((valorBase + acrescimo).toFixed(2));

      let desconto = 0;
      if (valorFinal > 500) {
        desconto = Number((valorFinal * 0.10).toFixed(2));
        valorFinal = Number((valorFinal - desconto).toFixed(2));
      }

      let taxaAdicional = 0;
      if (Number(pedido.pesoKg_pedido) > 50) {
        taxaAdicional = 15.00;
        valorFinal = Number((valorFinal + taxaAdicional).toFixed(2));
      }

      const salvarEntrega = {
        id_pedido,
        valorDistancia_entrega: Number(valorDistancia.toFixed(2)),
        valorPeso_entrega: Number(valorPeso.toFixed(2)),
        acrescimo_entrega: Number(acrescimo.toFixed(2)),
        desconto_entrega: Number(desconto.toFixed(2)),
        taxaAdicional_entrega: Number(taxaAdicional.toFixed(2)),
        valorFinal_entrega: Number(valorFinal.toFixed(2)),
        status_entrega: 'calculado'
      };

      const result = await entregaModel.criarEntrega(salvarEntrega);

      return res.status(201).json({ id_entrega: result.id, entrega: salvarEntrega });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao calcular / registrar entrega.' });
    }
  },

  /**
   * Retorna todas as entregas cadastradas.
   * 
   * Rota: GET /entregas
   *
   * @async
   * @function listarEntregas
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async listarEntregas(req, res) {
    try {
      const entregas = await entregaModel.listarTodas();
      return res.status(200).json(entregas);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao listar entregas.', errorMessage: error.message });
    }
  },

  /**
   * Busca entregas relacionadas a um pedido específico.
   * 
   * Rota: GET /entregas/pedido/:id_pedido
   *
   * @async
   * @function buscarPorPedido
   * @param {Request} req Requisição com id_pedido na URL.
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async buscarPorPedido(req, res) {
    try {
      const id_pedido = Number(req.params.id_pedido);

      if (isNaN(id_pedido) || id_pedido <= 0)
        return res.status(400).json({ message: 'ID inválido.' });

      const entregas = await entregaModel.buscarPorPedido(id_pedido);
      return res.json(entregas);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar entregas.' });
    }
  },

  /**
   * Atualiza o status de uma entrega.
   * 
   * Rota: PUT /entregas/status/:id
   *
   * @async
   * @function atualizarStatus
   * @param {Request} req Requisição HTTP contendo id da entrega e novo status.
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async atualizarStatus(req, res) {
    try {
      const id_entrega = Number(req.params.id);
      const { status } = req.body;

      if (isNaN(id_entrega) || id_entrega <= 0)
        return res.status(400).json({ message: 'ID inválido.' });

      const validar = ['calculado', 'em_transito', 'entregue', 'cancelado'];
      if (!validar.includes(status))
        return res.status(400).json({ message: 'Status inválido.' });

      const ok = await entregaModel.atualizarStatus(id_entrega, status);
      if (!ok)
        return res.status(404).json({ message: 'Entrega não encontrada.' });

      return res.json({ message: 'Status atualizado.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar status.' });
    }
  },

  /**
   * Deleta uma entrega pelo ID.
   * 
   * Rota: DELETE /entregas/:id
   *
   * @async
   * @function deletarEntrega
   * @param {Request} req Requisição HTTP contendo id da entrega.
   * @param {Response} res
   * @returns {Promise<void>}
   */
  async deletarEntrega(req, res) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0)
        return res.status(400).json({ message: 'ID inválido.' });

      const resultado = await entregaModel.deletarEntrega(id);

      if (!resultado || resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Entrega não encontrado.' });
      }

      return res.json({ message: 'Entrega deletada com sucesso.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar entrega.', errorMessage: error.message });
    }
  }
};

module.exports = { entregaController };
