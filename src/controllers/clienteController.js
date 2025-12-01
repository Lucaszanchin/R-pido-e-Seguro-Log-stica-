const { clienteModel } = require('../models/clienteModel');

/**
 * Controlador responsável por gerenciar operações relacionadas aos clientes.
 * Inclui listagem, busca por ID, inclusão, atualização e exclusão.
 * @namespace clienteController
 */
const clienteController = {

  /**
   * Retorna todos os clientes cadastrados no banco de dados.
   * Rota: GET /clientes
   * @async
   * @function buscarTodosClientes
   * @param {Request} req Objeto da requisição HTTP.
   * @param {Response} res Objeto da resposta HTTP.
   * @returns {Promise<void>}
   */
  buscarTodosClientes: async (req, res) => {
    try {
      const resultado = await clienteModel.selecionarTodos();

      if (!resultado || resultado.length === 0) {
        return res.status(200).json({ message: 'A tabela selecionada não contém dados', data: [] });
      }

      res.status(200).json({ message: 'Dados recebidos', data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
    }
  },

  /**
   * Busca um cliente específico pelo ID informado.
   * Rota: GET /clientes/:idCliente
   * @async
   * @function buscarClientePorID
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  buscarClientePorID: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);

      if (isNaN(idCliente) || idCliente <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const resultado = await clienteModel.selecionarPorId(idCliente);

      if (!resultado) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      return res.status(200).json(resultado);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar cliente.', errorMessage: error.message });
    }
  },

  /**
   * Inclui um novo cliente no banco de dados.
   * Rota: POST /clientes
   * @async
   * @function incluirCliente
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  incluirCliente: async (req, res) => {
    try {
      const { nome, sobrenome, cpf, telefone, email, logradouro, rua, numero, bairro, cidade, estado, cep } = req.body;

      if (!nome || !sobrenome || !cpf || !telefone || !email || !logradouro || !rua || !numero || !bairro || !cidade || !estado || !cep || typeof nome !== 'string' || typeof sobrenome !== 'string' || typeof cpf !== 'string' || typeof telefone !== 'string' || typeof email !== 'string' || typeof logradouro !== 'string' || typeof rua !== 'string' || typeof numero !== 'string' || typeof bairro !== 'string' || typeof cidade !== 'string' || typeof estado !== 'string' || typeof cep !== 'string' || cpf.length !== 11 || estado.length !== 2 || cep.length !== 8) {
        return res.status(400).json({ message: 'Os dados envidos estão incorretos. Envie novamente.' });
      }

      const resultadoId = await clienteModel.selecionarPorCpf(cpf)
      if (resultadoId.length === 1) {
      return res.status(409).json({ message: 'Esse CPF já existe.' })
      }

      const resultado = await clienteModel.inserirCliente(nome.trim(), sobrenome.trim(), cpf.trim(), telefone.trim(), email.trim(), logradouro.trim(), rua.trim(), numero.trim(), bairro.trim(), cidade.trim(), estado.trim(), cep.trim());

      if (resultado.affectedRows === 1 && resultado.insertId) {
        res.status(201).json({ message: 'Registro incluído com sucesso', result: resultado });
      } else {
        throw new Error('Ocorreu um erro ao incluir o registro');
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  /**
   * Atualiza as informações de um cliente já cadastrado.
   * Rota: PUT /clientes/:idCliente
   * @async
   * @function atualizarCliente
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  atualizarCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);

      if (isNaN(idCliente) || idCliente <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      let {nome, sobrenome, cpf, telefone, email, logradouro, rua, numero, bairro, cidade, estado, cep} = req.body;

      const clienteAtual = await clienteModel.selecionarPorId(idCliente);

      if (!clienteAtual || clienteAtual.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      const cliente = clienteAtual[0];

      const novoNome = nome ?? cliente.nome_cliente;
      const novoSobrenome = sobrenome ?? cliente.sobrenome_cliente;
      const novoCpf = cpf ?? cliente.cpf_cliente;
      const novoTelefone = telefone ?? cliente.telefone_cliente;
      const novoEmail = email ?? cliente.email_cliente;
      const novoLogradouro = logradouro ?? cliente.logradouro_cliente;
      const novoRua = rua ?? cliente.rua_cliente;
      const novoNumero = numero ?? cliente.numero_cliente;
      const novoBairro = bairro ?? cliente.bairro_cliente;
      const novoCidade = cidade ?? cliente.cidade_cliente;
      const novoEstado = estado ?? cliente.estado_cliente;
      const novoCep = cep ?? cliente.cep_cliente;

      const resultado = await clienteModel.atualizarCliente(idCliente, novoNome, novoSobrenome, novoCpf, novoTelefone, novoEmail, novoLogradouro, novoRua, novoNumero, novoBairro, novoCidade, novoEstado, novoCep);

      if (!resultado || resultado.affectedRows === 0) {
        return res.status(500).json({ message: 'Erro ao atualizar o Cliente.' });
      }

      return res.status(200).json({message: 'Cliente atualizado com sucesso.', data: {idCliente, nome: novoNome, sobrenome: novoSobrenome, cpf: novoCpf, telefone: novoTelefone, email: novoEmail, logradouro: novoLogradouro, rua: novoRua, numero: novoNumero, bairro: novoBairro, cidade: novoCidade, estado: novoEstado, cep: novoCep}});

    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Ocorreu um erro no servidor.', errorMessage: error.message
});
    }
  },

  /**
   * Exclui um cliente do banco de dados através do ID.
   * Rota: DELETE /clientes/:idCliente
   * @async
   * @function excluindoCliente
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */
  excluindoCliente: async (req, res) => {
    try {
      const id = Number(req.params.idCliente);

      if (!id || !Number.isInteger(id)) {
        return res.status(400).json({ message: 'Forneça um ID válido' });
      }

      const resultado = await clienteModel.selecionarPorId(id)

      if (resultado.length === 0) {
        throw new Error("Registro não localizado")
      } else {
        const resultado = await clienteModel.deleteCliente(id);
        if (resultado.affectedRows === 1) {
          return res.status(200).json({ message: 'O cliente foi excluído com sucesso', data: resultado })
        } else {
          throw new Error("Não foi possível excluir o cliente");
        }
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

};

module.exports = { clienteController };
