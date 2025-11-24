const { clienteModel } = require('../models/clienteModel');

const clienteController = {

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

  buscarClientePorID: async (req, res) => {
    try {
      const id = Number(req.query.id);

      if (!id || !Number.isInteger(id)) {
        return res.status(400).json({ message: 'Forneça um identificador (ID) válido' });
      }

      const resultado = await clienteModel.selecionarPorId(id);

      if (!resultado || resultado.length === 0) {
        return res.status(404).json({ message: `Nenhum cliente encontrado com ID ${id}` });
      }

      res.status(200).json({ message: 'Cliente encontrado', data: resultado[0] });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

  incluirCliente: async (req, res) => {
    try {
      const { nome, sobrenome, cpf, telefone, email, logradouro, rua, numero, bairro, cidade, estado, cep } = req.body;

      if (!nome || !sobrenome || !cpf || !telefone || !email || !logradouro || !rua || !numero || !bairro || !cidade || !estado || !cep || typeof nome !== 'string' || typeof sobrenome !== 'string' || typeof cpf !== 'string' || typeof telefone !== 'string' || typeof email !== 'string' || typeof logradouro !== 'string' || typeof rua !== 'string' || typeof numero !== 'string' || typeof bairro !== 'string' || typeof cidade !== 'string' || typeof estado !== 'string' || typeof cep !== 'string' || cpf.length !== 11 || estado.length !== 2 || cep.length !== 8) {
        return res.status(400).json({ message: 'Os dados envidos estão icorretos. Envie novamente.' });
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

  atualizarCliente: async (req, res) => {
    try {
      const idCliente = Number(req.params.idCliente);

      if (isNaN(idCliente) || idCliente <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      let {
        nome, sobrenome, cpf, telefone, email,
        logradouro, rua, numero, bairro, cidade, estado, cep
      } = req.body;


      const clienteAtual = await clienteModel.selecionarPorId(idCliente);

      if (!clienteAtual || clienteAtual.length === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      const c = clienteAtual[0]; // cliente atual do banco

      // Corrigido: usar nomes que existem no banco
      const novoNome = nome ?? c.nome_cliente;
      const novoSobrenome = sobrenome ?? c.sobrenome_cliente;
      const novoCpf = cpf ?? c.cpf_cliente;
      const novoTelefone = telefone ?? c.telefone_cliente;
      const novoEmail = email ?? c.email_cliente;
      const novoLogradouro = logradouro ?? c.logradouro_cliente;
      const novoRua = rua ?? c.rua_cliente;
      const novoNumero = numero ?? c.numero_cliente;
      const novoBairro = bairro ?? c.bairro_cliente;
      const novoCidade = cidade ?? c.cidade_cliente;
      const novoEstado = estado ?? c.estado_cliente;
      const novoCep = cep ?? c.cep_cliente;

      const resultado = await clienteModel.atualizarCliente(
        idCliente,
        novoNome,
        novoSobrenome,
        novoCpf,
        novoTelefone,
        novoEmail,
        novoLogradouro,
        novoRua,
        novoNumero,
        novoBairro,
        novoCidade,
        novoEstado,
        novoCep
      );

      if (!resultado || resultado.affectedRows === 0) {
        return res.status(500).json({ message: 'Erro ao atualizar o Cliente.' });
      }

      return res.status(200).json({
        message: 'Cliente atualizado com sucesso.',
        data: {
          idCliente,
          nome: novoNome,
          sobrenome: novoSobrenome,
          cpf: novoCpf,
          telefone: novoTelefone,
          email: novoEmail,
          logradouro: novoLogradouro,
          rua: novoRua,
          numero: novoNumero,
          bairro: novoBairro,
          cidade: novoCidade,
          estado: novoEstado,
          cep: novoCep
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocorreu um erro no servidor.',
        errorMessage: error.message
      });
    }
  },

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
          return res.status(200).json({ message: 'O cleiente foi excluído com sucesso', data: resultado })
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