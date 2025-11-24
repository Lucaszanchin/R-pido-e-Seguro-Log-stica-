const pool = require('../config/db');

const clienteModel = {

    // Seleciona todos os clientes
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM clientes';
        const [rows] = await pool.query(sql);
        return rows;
    },

    // Seleciona cliente pelo ID
    selecionarPorId: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    },

    // Seleciona cliente pelo CPF
    selecionarPorCpf: async (pCpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf_cliente = ?';
        const [rows] = await pool.query(sql, [pCpf]);
        return rows;
    },

    // Inserir novo cliente
    inserirCliente: async (pNome, pSobrenome, pCpf, pTelefone, pEmail, pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep) => {
        const sql = 'INSERT INTO clientes (nome_cliente, sobrenome_cliente, cpf_cliente, telefone_cliente, email_cliente, logradouro_cliente, rua_cliente, numero_cliente, bairro_cliente, cidade_cliente, estado_cliente, cep_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await pool.query(sql, [pNome, pSobrenome, pCpf, pTelefone, pEmail, pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep]);
        return result;
    },

    atualizarCliente: async (pId, pNome, pSobrenome, pCpf, pTelefone, pEmail, pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep
    ) => {

        const sql = ` UPDATE clientes SET nome_cliente = ?, sobrenome_cliente = ?, cpf_cliente = ?, telefone_cliente = ?, email_cliente = ?, logradouro_cliente = ?, rua_cliente = ?, numero_cliente = ?,  bairro_cliente = ?, cidade_cliente = ?,  estado_cliente = ?, cep_cliente = ? WHERE id_cliente = ?;`;

        const values = [pNome, pSobrenome, pCpf, pTelefone, pEmail, pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep, pId];

        const [result] = await pool.query(sql, values);
        return result;
    },



    // Deletar cliente por ID
    deleteCliente: async (pId) => {
        const sql = "DELETE FROM clientes WHERE id_cliente = ?";
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    }
};

module.exports = { clienteModel };
