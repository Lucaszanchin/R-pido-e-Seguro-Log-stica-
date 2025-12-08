const pool = require('../config/db');
// Importa a configuração do banco de dados

const clienteModel = {
    // Objeto que armazena todas as funções relacionadas ao cliente

    /**
     * Seleciona todos os clientes cadastrados.
     * @async
     * @function
     * @returns {Promise<Array>} Retorna um array com todos os registros da tabela clientes.
     */
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM clientes';
        // Query SQL para buscar todos os clientes

        const [rows] = await pool.query(sql);
        // Executa a query no banco e obtém os registros

        return rows;
        // Retorna todos os clientes
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
        // Query SQL com parâmetro para buscar por ID

        const [rows] = await pool.query(sql, [pId]);
        // Executa a query passando o ID

        return rows;
        // Retorna o resultado (pode ser vazio ou 1 cliente)
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
        const sql = `INSERT INTO clientes (nome_cliente, sobrenome_cliente, cpf_cliente, telefone_cliente, email_cliente, logradouro_cliente, rua_cliente, numero_cliente, bairro_cliente, cidade_cliente, estado_cliente, cep_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        // Query SQL para inserir um novo cliente no banco

        const [result] = await pool.query(sql, [pNome, pSobrenome, pCpf, pTelefone, pEmail, pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep]);
        // Execução da query com valores para inserir

        return result;
        // Retorna informações como insertId e affectedRows
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
    atualizarCliente: async (pId, pNome, pSobrenome, pCpf, pTelefone, pEmail, pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep) => {

        const sql = `UPDATE clientes SET nome_cliente = ?, sobrenome_cliente = ?, cpf_cliente = ?, telefone_cliente = ?, email_cliente = ?, logradouro_cliente = ?, rua_cliente = ?, numero_cliente = ?, bairro_cliente = ?, cidade_cliente = ?, estado_cliente = ?, cep_cliente = ? WHERE id_cliente = ?;`;
        // Query SQL para atualizar os dados do cliente

        const values = [pNome, pSobrenome, pCpf, pTelefone, pEmail, pLogradouro, pRua, pNumero, pBairro, pCidade, pEstado, pCep, pId];
        // Array com todos os valores que serão enviados no update

        const [result] = await pool.query(sql, values);
        // Execução da query com os dados atualizados

        return result;
        // Retorna quantidade de linhas afetadas e outras infos
    },

    /**
     * Deleta um cliente pelo ID.
     * @async
     * @function
     * @param {number} pId - ID do cliente a ser removido.
     * @returns {Promise<Object>} Retorna o resultado da exclusão.
     * */
    deleteCliente: async (pId) => {
        const sql = "DELETE FROM clientes WHERE id_cliente = ?";
        // Query SQL para remover cliente pelo ID

        const [rows] = await pool.query(sql, [pId]);
        // Execução do delete passando o ID como parâmetro

        return rows;
        // Retorna resultado do delete
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
        // Query SQL para contar pedidos registrados para o cliente

        const [rows] = await pool.query(sql, [clienteId]);
        // Execução da query passando o ID do cliente

        return rows[0].total;
        // Retorna apenas o número total de pedidos vinculados
    },

    /**
     * Busca todas as entregas vinculadas a um cliente específico.
     *
     * @async
     * @function buscarEntregasPorCliente
     * @param {number} id_cliente - ID do cliente para filtrar as entregas.
     * @returns {Promise<Array<Object>>} Lista de entregas relacionadas ao cliente.
     */
    buscarEntregasPorCliente: async (id_cliente) => {
        const sql = `SELECT c.nome_cliente, e. * FROM entregas e JOIN pedidos p ON e.id_pedido = p.id_pedido JOIN clientes c ON c.id_cliente = p.id_cliente WHERE c.id_cliente = ?;`;
        // Consulta SQL que busca o nome do cliente (c.nome_cliente), e todas as colunas da tabela de entregas (e.*), 
        // Faz JOIN entre entregas (e), pedidos (p) e clientes (c) | Primeiro JOIN: liga entrega ao pedido pelo id_pedido | Segundo JOIN: liga pedido ao cliente pelo id_cliente
        // Filtra para retornar somente as entregas do cliente cujo id é passado no parâmetro (WHERE c.id_cliente = ?)

        const [rows] = await pool.query(sql, [id_cliente]);
        // Execução da query passando o ID do cliente

        return rows;
    }
};

module.exports = { clienteModel };
// Exporta o model para ser usado no controller

