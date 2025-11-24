const { entregaModel } = require('../models/entregaModel');
const { pedidoModel } = require('../models/pedidoModel');

const entregaController = {
  async calcularERegistrar(req, res) {
    try {
      const { id_pedido } = req.body;

      if (!id_pedido) return res.status(400).json({ message: 'id_pedido é obrigatório.' });

      // buscar pedido

      const pedido = await pedidoModel.buscarPorId(id_pedido);
      if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado.' });

      // valor da distância = distanciaKm_pedido * valoBaseKm_pedido
      const valorDistancia = Number(pedido.distanciaKm_pedido) * Number(pedido.valoBaseKm_pedido);

      // valor do peso = pesoKg_pedido * valorBaseKg_pedido
      const valorPeso = Number(pedido.pesoKg_pedido) * Number(pedido.valorBaseKg_pedido);

      // valor base = soma
      const valorBase = Number(valorDistancia) + Number(valorPeso);

      // acrescimo se urgente: +20% sobre valor base
      let acrescimo = 0;
      if (pedido.tipoEntrega_pedido === 'urgente') {
        acrescimo = Number((valorBase * 0.20).toFixed(2));
      }

      // valor final inicial
      let valorFinal = Number((valorBase + acrescimo).toFixed(2));

      // desconto de 10% se valorFinal > 500
      let desconto = 0;
      if (valorFinal > 500) {
        desconto = Number((valorFinal * 0.10).toFixed(2));
        valorFinal = Number((valorFinal - desconto).toFixed(2));
      }

      // taxa adicional se peso > 50kg
      let taxaAdicional = 0;
      if (Number(pedido.pesoKg_pedido) > 50) {
        taxaAdicional = 15.00;
        valorFinal = Number((valorFinal + taxaAdicional).toFixed(2));
      }

      const entregaToSave = {id_pedido: id_pedido, valorDistancia_entrega: Number(valorDistancia.toFixed(2)), valorPeso_entrega: Number(valorPeso.toFixed(2)), acrescimo_entrega: Number(acrescimo.toFixed(2)), desconto_entrega: Number(desconto.toFixed(2)), taxaAdicional_entrega: Number(taxaAdicional.toFixed(2)), valorFinal_entrega: Number(valorFinal.toFixed(2)), status_entrega: 'calculado'
      };

      const result = await entregaModel.criarEntrega(entregaToSave);
      return res.status(201).json({ id_entrega: result.id, entrega: entregaToSave });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao calcular / registrar entrega.' });
    }
  },

  async listarEntregas(req, res) {
    try {
      const entregas = await entregaModel.listarTodas();
      return res.status(200).json(entregas);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao listar entregas.' });
              errorMessage: error.message 
    }
  },

  async buscarPorPedido(req, res) {
    try {
      const id_pedido = Number(req.params.id_pedido);
      if (isNaN(id_pedido) || id_pedido <= 0) return res.status(400).json({ message: 'ID inválido.' });
      const entregas = await entregaModel.buscarPorPedido(id_pedido);
      return res.json(entregas);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar entregas.' });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const id_entrega = Number(req.params.id);
      const { status } = req.body;

      if (isNaN(id_entrega) || id_entrega <= 0) return res.status(400).json({ message: 'ID inválido.' });

      const valid = ['calculado','em_transito','entregue','cancelado'];
      if (!valid.includes(status)) return res.status(400).json({ message: 'Status inválido.' });

      const ok = await entregaModel.atualizarStatus(id_entrega, status);
      if (!ok) return res.status(404).json({ message: 'Entrega não encontrada.' });

      return res.json({ message: 'Status atualizado.' });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao atualizar status.' });
    }
  }
};

module.exports = { entregaController };
