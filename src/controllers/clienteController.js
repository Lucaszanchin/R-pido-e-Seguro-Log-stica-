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

      if (!nome || !sobrenome ||!cpf || !telefone || !email || !logradouro || !rua || !numero || !bairro || !cidade || !estado || !cep ||typeof nome !== 'string' || typeof sobrenome !== 'string' || typeof cpf !== 'string' || typeof telefone !== 'string' || typeof email !== 'string' || typeof logradouro !== 'string' || typeof rua !== 'string' ||typeof numero !== 'string' ||typeof bairro !== 'string' ||typeof cidade !== 'string' || typeof estado !== 'string' || typeof cep !== 'string' || cpf.length !== 11 || estado.length !== 2 || cep.length !== 8) {
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
      return res.status(400).json({ message: 'ID do Cliente inválido.' });
    }

    // Dados enviados no corpo da requisição
    let {
      nome,
      sobrenome,
      cpf,
      telefone,
      email,
      logradouro,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cep
    } = req.body;

    // Buscar cliente atual
    const clienteAtual = await clienteModel.selecionarPorId(idCliente);

    if (!clienteAtual || clienteAtual.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    const cliente = clienteAtual[0];

    // ====== VALIDAÇÕES SOMENTE DO QUE FOI ENVIADO ======
    if (nome !== undefined) {
      if (typeof nome !== 'string' || nome.trim().length < 3) {
        return res.status(400).json({ message: 'Nome inválido.' });
      }
      nome = nome.trim();
    }

    if (cpf !== undefined) {
      if (cpf.length !== 11) {
        return res.status(400).json({ message: 'CPF inválido.' });
      }
    }

    if (estado !== undefined) {
      if (estado.length !== 2) {
        return res.status(400).json({ message: 'Estado inválido.' });
      }
    }

    if (cep !== undefined) {
      if (cep.length !== 8) {
        return res.status(400).json({ message: 'CEP inválido.' });
      }
    }

    const novoNome = nome ?? cliente.nome;
    const novoSobrenome = sobrenome ?? cliente.sobrenome;
    const novoCpf = cpf ?? cliente.cpf;
    const novoTelefone = telefone ?? cliente.telefone;
    const novoEmail = email ?? cliente.email;
    const novoLogradouro = logradouro ?? cliente.logradouro;
    const novoRua = rua ?? cliente.rua;
    const novoNumero = numero ?? cliente.numero;
    const novoBairro = bairro ?? cliente.bairro;
    const novoCidade = cidade ?? cliente.cidade;
    const novoEstado = estado ?? cliente.estado;
    const novoCep = cep ?? cliente.cep;

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
      return res.status(500).json({ message: 'Erro ao atualizar cliente.' });
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
  }

}

module.exports = { clienteController };