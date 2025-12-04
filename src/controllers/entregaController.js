const { entregaModel } = require('../models/entregaModel'); // Importa o model de entregas
const { pedidoModel } = require('../models/pedidoModel');   // Importa o model de pedidos

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
      const { id_pedido } = req.body; // Recebe o id do pedido enviado pelo id_pedido

      // Valida se o id foi enviado
      if (!id_pedido)
        return res.status(400).json({ message: 'id pedido é obrigatório.' });

      // Busca o pedido no banco
      const pedido = await pedidoModel.buscarPorId(id_pedido);
      if (!pedido)
        return res.status(404).json({ message: 'Pedido não encontrado.' });

      // -------- CÁLCULOS DA ENTREGA --------

      // Calcula custo por distância e peso
      const valorDistancia = Number(pedido.distanciaKm_pedido) * Number(pedido.valorBaseKm_pedido);
      const valorPeso = Number(pedido.pesoKg_pedido) * Number(pedido.valorBaseKg_pedido);
      const valorBase = valorDistancia + valorPeso;

      let acrescimo = 0;

      // Se entrega for urgente → adiciona 20%
      if (pedido.tipoEntrega_pedido === 'urgente') {
        acrescimo = Number((valorBase * 0.20).toFixed(2));
      }

      let valorFinal = Number((valorBase + acrescimo).toFixed(2));

      let desconto = 0;

      // Se valor da entrega for maior que 500 → aplica desconto de 10%
      if (valorFinal > 500) {
        desconto = Number((valorFinal * 0.10).toFixed(2));
        valorFinal = Number((valorFinal - desconto).toFixed(2));
      }

      let taxaAdicional = 0;

      // Peso acima de 50kg → taxa fixa de 15 reais
      if (Number(pedido.pesoKg_pedido) > 50) {
        taxaAdicional = 15.00;
        valorFinal = Number((valorFinal + taxaAdicional).toFixed(2));
      }

      // Monta objeto com todos os valores calculados
      const salvarEntrega = {
        id_pedido,
        valorDistancia_entrega: Number(valorDistancia.toFixed(2)),
        valorPeso_entrega: Number(valorPeso.toFixed(2)),
        acrescimo_entrega: Number(acrescimo.toFixed(2)),
        desconto_entrega: Number(desconto.toFixed(2)),
        taxaAdicional_entrega: Number(taxaAdicional.toFixed(2)),
        valorFinal_entrega: Number(valorFinal.toFixed(2)),
        status_entrega: 'calculado' // Entrega começa no status "calculado"
      };

      // Salva no banco
      const result = await entregaModel.criarEntrega(salvarEntrega);

      // Retorna a entrega criada
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
      const entregas = await entregaModel.listarTodas(); // Busca todas as entregas no banco
      return res.status(200).json(entregas);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao listar entregas.', errorMessage: error.message });
    }
  },

  async buscarEntregaPorId(req, res) {
    try {
      const id = Number(req.params.id); // Converte parâmetro para número

      // Verifica ID válido
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      // Busca entrega
      const entrega = await entregaModel.buscarPorId(id);

      if (!entrega) {
        return res.status(404).json({ message: 'Entrega não encontrado.' });
      }

      return res.status(200).json(entrega); // Retorna a entrega

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar entrega.' });
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
      const id_pedido = Number(req.params.id_pedido); // Pega ID da URL

      // Valida ID
      if (isNaN(id_pedido) || id_pedido <= 0)
        return res.status(400).json({ message: 'ID inválido.' });

      // Busca entregas relacionadas ao pedido
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
      const id_entrega = Number(req.params.id); // ID da entrega na URL
      const { status } = req.body;             // Novo status enviado no body

      // Valida o ID
      if (isNaN(id_entrega) || id_entrega <= 0)
        return res.status(400).json({ message: 'ID inválido.' });

      // Lista de status permitidos
      const validar = ['calculado', 'em_transito', 'entregue', 'cancelado'];

      // Valida se status existe
      if (!validar.includes(status))
        return res.status(400).json({ message: 'Status inválido.' });

      // Atualiza no banco
      const ok = await entregaModel.atualizarStatus(id_entrega, status);

      // Se não achou a entrega
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
      const id = Number(req.params.id); // ID da entrega

      // Valida o ID
      if (isNaN(id) || id <= 0)
        return res.status(400).json({ message: 'ID inválido.' });

      // Tenta deletar no banco
      const resultado = await entregaModel.deletarEntrega(id);

      // Se não encontrou a entrega
      if (!resultado || resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Entrega não encontrado.' });
      }

      return res.json({ message: 'Entrega deletada com sucesso.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar entrega.', errorMessage: error.message });
    }
  },

  /**
   * Atualiza uma entrega existente.
   * 
   * @async
   * @function atualizarEntrega
   * @param {Object} req - Objeto da requisição Express.
   * @param {Object} res - Objeto da resposta Express.
   * @returns {Promise<void>} Retorna uma resposta HTTP com o resultado da operação.
   */
  async atualizarEntrega(req, res) {
    try {

      // Converte o ID vindo dos parâmetros da rota para número
      const id = Number(req.params.id); // ID da entrega

      // Verifica se o ID é válido
      if (!id) {
        return res.status(400).json({ message: "Id inválido." });
      }

      // Busca a entrega atual no banco
      const entregaAtual = await entregaModel.buscarPorId(id);

      // Se não existir, retorna erro 404
      if (!entregaAtual) {
        return res.status(404).json({ message: "Entrega não encontrada." });
      }

      // Desestrutura o body recebidos na requisição
      let {id_pedido, valorDistancia_entrega, valorPeso_entrega, acrescimo_entrega, desconto_entrega, taxaAdicional_entrega, valorFinal_entrega} = req.body;

      // Se algum campo não vier no body, usa o valor atual do banco
      id_pedido = id_pedido ?? entregaAtual.id_pedido;
      valorDistancia_entrega = valorDistancia_entrega ?? entregaAtual.valorDistancia_entrega;
      valorPeso_entrega = valorPeso_entrega ?? entregaAtual.valorPeso_entrega;
      acrescimo_entrega = acrescimo_entrega ?? entregaAtual.acrescimo_entrega;
      desconto_entrega = desconto_entrega ?? entregaAtual.desconto_entrega;
      taxaAdicional_entrega = taxaAdicional_entrega ?? entregaAtual.taxaAdicional_entrega;
      valorFinal_entrega = valorFinal_entrega ?? entregaAtual.valorFinal_entrega;

      // Chama o model para atualizar no banco
      const resultado = await entregaModel.atualizarEntrega(id_pedido, valorDistancia_entrega, valorPeso_entrega, acrescimo_entrega, desconto_entrega, taxaAdicional_entrega, valorFinal_entrega, id);

      // Verifica se a atualização afetou alguma linha
      if (!resultado || resultado.affectedRows === 0) {
        return res.status(500).json({ message: "Erro ao atualizar entrega." });
      }

      // Retorna resposta de sucesso
      res.status(200).json({message: "Entrega atualizada com sucesso!", data: {id_entrega: id, id_pedido, valorDistancia_entrega, valorPeso_entrega, acrescimo_entrega, desconto_entrega, taxaAdicional_entrega, valorFinal_entrega}});

    } catch (error) {
      // Loga o erro no servidor e retorna erro 500
      console.log(error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  }
};

module.exports = { entregaController }; // Exporta o controlador