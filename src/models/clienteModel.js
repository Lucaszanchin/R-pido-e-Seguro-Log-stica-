const pool = require('../config/db');

const clienteModel = {

    /**
     * Seleciona todos os clientes cadastrados.
     * @async
     * @function
     * @returns {Promise<Array>} Retorna um array com todos os registros da tabela clientes.
     */
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM clientes';
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * Seleciona um cliente pelo ID.
     * @async
     * @function
     * @param {number} pId - ID do cliente a ser buscado.
     * @returns {Promise<Array>} Retorna um array (normalmente um único registro).
     */
    selecionarPorId: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    },

    /**
     * Seleciona um cliente pelo CPF.
     * @async
     * @function
     * @param {string} pCpf - CPF do cliente para consulta.
     * @returns {Promise<Array>} Retorna um array contendo o cliente com o CPF informado.
     */
    selecionarPorCpf: async (pCpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf_cliente = ?';
        const [rows] = await pool.query(sql, [pCpf]);
        return rows;
    },

    /**
     * Insere um novo cliente no banco de dados.
     * @async
     * @function
     * @param {string} pNome - Nome do cliente.
     * @param {string} pSobrenome - Sobrenome do cliente.
     * @param {string} pCpf - CPF do cliente.
     * @param {string} pTelefone - Telefone do cliente.
     * @param {string} pEmail - Email do cliente.
     * @param {string} pLogradouro - Logradouro do cliente.
     * @param {string} pRua - Rua do cliente.
     * @param {string} pNumero - Número do endereço.
     * @param {string} pBairro - Bairro do cliente.
     * @param {string} pCidade - Cidade do cliente.
     * @param {string} pEstado - Estado do cliente.
     * @param {string} pCep - CEP do cliente.
     * @returns {Promise<Object>} Retorna o resultado da inserção (insertId, affectedRows etc.).
     */
    inserirCliente: async (pNome, pSobrenome, pCpf, pTelefone, pEmail, pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep) => {
        const sql = `
            INSERT INTO clientes 
            (nome_cliente, sobrenome_cliente, cpf_cliente, telefone_cliente, email_cliente, logradouro_cliente, rua_cliente, numero_cliente, bairro_cliente, cidade_cliente, estado_cliente, cep_cliente) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
            pNome, pSobrenome, pCpf, pTelefone, pEmail,
            pLogradouro, pRua, pNumero, pBairro, pCidade,
            pEstado, pCep
        ]);
        return result;
    },

    /**
     * Atualiza os dados de um cliente existente.
     * @async
     * @function
     * @param {number} pId - ID do cliente a ser atualizado.
     * @param {string} pNome - Nome do cliente.
     * @param {string} pSobrenome - Sobrenome do cliente.
     * @param {string} pCpf - CPF do cliente.
     * @param {string} pTelefone - Telefone do cliente.
     * @param {string} pEmail - Email do cliente.
     * @param {string} pLogradouro - Logradouro do cliente.
     * @param {string} pRua - Rua do cliente.
     * @param {string} pNumero - Número do endereço.
     * @param {string} pBairro - Bairro do cliente.
     * @param {string} pCidade - Cidade do cliente.
     * @param {string} pEstado - Estado do cliente.
     * @param {string} pCep - CEP do cliente.
     * @returns {Promise<Object>} Retorna o resultado da atualização (changedRows etc.).
     */
    atualizarCliente: async (
        pId, pNome, pSobrenome, pCpf, pTelefone, pEmail,
        pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep
    ) => {

        const sql = `
            UPDATE clientes 
            SET nome_cliente = ?, sobrenome_cliente = ?, cpf_cliente = ?, telefone_cliente = ?, 
                email_cliente = ?, logradouro_cliente = ?, rua_cliente = ?, numero_cliente = ?,  
                bairro_cliente = ?, cidade_cliente = ?, estado_cliente = ?, cep_cliente = ? 
            WHERE id_cliente = ?;
        `;

        const values = [
            pNome, pSobrenome, pCpf, pTelefone, pEmail,
            pLogradouro, pRua, pNumero, pBairro, pCidade,
            pEstado, pCep, pId
        ];

        const [result] = await pool.query(sql, values);
        return result;
    },

    /**
     * Deleta um cliente pelo ID.
     * @async
     * @function
     * @param {number} pId - ID do cliente a ser removido.
     * @returns {Promise<Object>} Retorna o resultado da exclusão.
     */
    deleteCliente: async (pId) => {
        const sql = "DELETE FROM clientes WHERE id_cliente = ?";
        const [rows] = await pool.query(sql, [pId]);
        return rows;
    },

    /**
     * Verifica quantos pedidos estão vinculados a um cliente específico.
     * 
     * @async
     * @function
     * @param {number} clienteId - ID do cliente que será verificado.
     * @returns {Promise<number>} Retorna a quantidade total de pedidos vinculados ao cliente.
     */
    verificarPedidosVinculados: async (clienteId) => {
        const sql = 'SELECT COUNT(*) AS total FROM pedidos WHERE id_cliente = ?';
        const [linhas] = await pool.query(sql, [clienteId]);
        return linhas[0].total;

    }
};

module.exports = { clienteModel };
