const { clienteModel } = require('../models/clienteModel');
// Importa o model responsável pelas operações no banco de dados para clientes.

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
      // Busca todos os clientes no banco

      if (!resultado || resultado.length === 0) {
        // Caso não haja registros
        return res.status(200).json({ message: 'A tabela selecionada não contém dados', data: [] });
      }

      // Retorna todos os clientes encontrados
      res.status(200).json({ message: 'Dados recebidos', data: resultado });
    } catch (error) {
      // Caso aconteça algum erro na execução
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
      // Converte o parâmetro da rota para número

      if (isNaN(idCliente) || idCliente <= 0) {
        // Validação de ID inválido
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const resultado = await clienteModel.selecionarPorId(idCliente);
      // Consulta o cliente pelo ID

      if (!resultado) {
        // Caso o cliente não seja encontrado
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      // Retorna o cliente encontrado
      return res.status(200).json(resultado);

    } catch (error) {
      // Tratamento de erros
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
      // Extrai os dados enviados pelo corpo da requisição
      const { nome, sobrenome, cpf, telefone, email, logradouro, rua, numero, bairro, cidade, estado, cep } = req.body;

      // Validação de campos obrigatórios e tipos
      if (!nome || !sobrenome || !cpf || !telefone || !email || !logradouro || !rua || !numero || !bairro || !cidade || !estado || !cep || typeof nome !== 'string' || typeof sobrenome !== 'string' || typeof cpf !== 'string' ||
        typeof telefone !== 'string' || typeof email !== 'string' || typeof logradouro !== 'string' ||
        typeof rua !== 'string' || typeof numero !== 'string' || typeof bairro !== 'string' ||
        typeof cidade !== 'string' || typeof estado !== 'string' || typeof cep !== 'string' ||
        cpf.length !== 11 || estado.length !== 2 || cep.length !== 8) {

        return res.status(400).json({ message: 'Os dados envidos estão incorretos. Envie novamente.' });
      }

      // Verifica se já existe um cliente com mesmo CPF
      const resultadoId = await clienteModel.selecionarPorCpf(cpf);
      if (resultadoId.length === 1) {
        return res.status(409).json({ message: 'Esse CPF já existe.' });
      }

      // Insere o novo cliente no banco
      const resultado = await clienteModel.inserirCliente(
        nome.trim(), sobrenome.trim(), cpf.trim(), telefone.trim(), email.trim(),
        logradouro.trim(), rua.trim(), numero.trim(), bairro.trim(),
        cidade.trim(), estado.trim(), cep.trim()
      );

      // Confirmação de inclusão
      if (resultado.affectedRows === 1 && resultado.insertId) {
        res.status(201).json({ message: 'Registro incluído com sucesso', result: resultado });
      } else {
        throw new Error('Ocorreu um erro ao incluir o registro');
      }

    } catch (error) {
      // Tratamento do erro no servidor
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
      // Obtém o ID do cliente a ser atualizado

      if (isNaN(idCliente) || idCliente <= 0) {
        // Validação de ID inválido
        return res.status(400).json({ message: 'ID inválido.' });
      }

      // Extrai dados do corpo da requisição
      let { nome, sobrenome, cpf, telefone, email, logradouro, rua, numero, bairro, cidade, estado, cep } = req.body;

      // Busca o cliente no banco
      const clienteAtual = await clienteModel.selecionarPorId(idCliente);

      if (!clienteAtual || clienteAtual.length === 0) {
        // Cliente não encontrado
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      const cliente = clienteAtual[0];
      // Cliente atual usado como base para campos que não foram enviados

      // Atualiza somente os campos enviados, mantendo os antigos como default
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

      // Atualiza no banco
      const resultado = await clienteModel.atualizarCliente(idCliente, novoNome, novoSobrenome, novoCpf, novoTelefone, novoEmail,
        novoLogradouro, novoRua, novoNumero, novoBairro, novoCidade, novoEstado, novoCep
      );

      if (!resultado || resultado.affectedRows === 0) {
        // Caso nenhuma linha tenha sido afetada
        return res.status(500).json({ message: 'Erro ao atualizar o Cliente.' });
      }

      // Retorna os dados atualizados
      return res.status(200).json({
        message: 'Cliente atualizado com sucesso.',
        data: {
          idCliente, nome: novoNome, sobrenome: novoSobrenome, cpf: novoCpf, telefone: novoTelefone, email: novoEmail, logradouro: novoLogradouro, rua: novoRua,
          numero: novoNumero, bairro: novoBairro, cidade: novoCidade, estado: novoEstado, cep: novoCep
        }
      });

    } catch (error) {
      // Tratamento de erros
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor.', errorMessage: error.message });
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
      // Converte o ID enviado na rota para número

      if (!id || !Number.isInteger(id)) {
        // Validação básica do ID
        return res.status(400).json({ message: 'ID inválido. Informe um número inteiro.' });
      }

      // Verifica se o cliente existe
      const cliente = await clienteModel.selecionarPorId(id);
      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      // Verifica se o cliente possui pedidos vinculados
      const qtdPedidos = await clienteModel.verificarPedidosVinculados(id);

      if (qtdPedidos > 0) {
        // Impede exclusão caso haja pedidos vinculados
        return res.status(400).json({
          message: `Não é possível excluir. O cliente possui ${qtdPedidos} pedido(s) vinculados.`,
        });
      }

      // Exclui o cliente
      const exclusao = await clienteModel.deleteCliente(id);

      if (exclusao.affectedRows === 1) {
        // Exclusão realizada com sucesso
        return res.status(200).json({ message: 'Cliente excluído com sucesso.', detalhes: exclusao });
      }

    } catch (error) {
      // Tratamento de erros
      console.error(error);
      return res.status(500).json({message: 'Erro interno no servidor.', detalhes: error.message});
    }
  }
};

// Exporta o controlador para ser usado nas rotas
module.exports = { clienteController };
