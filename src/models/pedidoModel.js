const pool = require('../config/db');

const pedidoModel = {

    /**
     * Insere um novo pedido no banco de dados.
     * 
     * @async
     * @function criarPedido
     * @param {Object} pedido - Objeto contendo os dados do pedido.
     * @param {number} pedido.id_cliente - ID do cliente que fez o pedido.
     * @param {string} pedido.data_pedido - Data em que o pedido foi realizado.
     * @param {string} pedido.tipoEntrega_pedido - Tipo de entrega selecionado.
     * @param {number} pedido.pesoKg_pedido - Peso total do pedido em kg.
     * @param {number} pedido.distanciaKm_pedido - Distância da entrega em km.
     * @param {number} pedido.valorBaseKm_pedido - Valor base por km.
     * @param {number} pedido.valorBaseKg_pedido - Valor base por kg.
     * @returns {Promise<Object>} Retorna o ID do pedido criado.
     */
    async criarPedido(pedido) {
        const connection = await pool.getConnection(); // Obtém conexão com o BD
        try {
            // Query de inserção
            const sql = `INSERT INTO pedidos (id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            // Executa a query com os valores
            const [result] = await connection.query(sql, [pedido.id_cliente, pedido.data_pedido, pedido.tipoEntrega_pedido, pedido.pesoKg_pedido, pedido.distanciaKm_pedido, pedido.valorBaseKm_pedido, pedido.valorBaseKg_pedido]);

            // Retorna o ID gerado
            return { id: result.insertId };
        } catch (error) {
            await connection.rollback(); // Cancela possível transação aberta
            throw error; // Devolve erro para o controller
        }
    },

    /**
     * Busca um pedido pelo ID.
     * 
     * @async
     * @function buscarPorId
     * @param {number} id - ID do pedido que será pesquisado.
     * @returns {Promise<Object|null>} Retorna o pedido encontrado ou null.
     */
    async buscarPorId(id) {
        const connection = await pool.getConnection(); // Abre conexão
        try {
            // Executa select por ID
            const [rows] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);

            // Retorna somente a primeira linha (ou undefined)
            return rows[0];

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Lista todos os pedidos cadastrados.
     * 
     * @async
     * @function listarTodosPedidos
     * @returns {Promise<Array>} Retorna uma lista com todos os pedidos.
     */
    async listarTodosPedidos() {
        const connection = await pool.getConnection(); // Conexão
        try {
            // Busca todos os pedidos
            const [rows] = await connection.query('SELECT * FROM pedidos');
            return rows;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Atualiza um pedido existente.
     * 
     * @async
     * @function atualizarPedido
     * @param {number} id - ID do pedido a ser atualizado.
     * @param {number} id_cliente - Novo ID do cliente.
     * @param {string} data_pedido - Data do pedido.
     * @param {string} tipoEntrega_pedido - Novo tipo de entrega.
     * @param {number} pesoKg_pedido - Novo peso em kg.
     * @param {number} distanciaKm_pedido - Nova distância em km.
     * @param {number} valorBaseKm_pedido - Novo valor por km.
     * @param {number} valorBaseKg_pedido - Novo valor por kg.
     * @returns {Promise<Object>} Resultado da atualização.
     */
    async atualizarPedido(id, id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido) {
        const connection = await pool.getConnection(); // Conexão
        try {
            // Query de update
            const sql = `UPDATE pedidos SET id_cliente = ?, data_pedido = ?, tipoEntrega_pedido = ?, pesoKg_pedido = ?, distanciaKm_pedido = ?, valorBaseKm_pedido = ?, valorBaseKg_pedido = ? WHERE id_pedido = ?`;

            const [result] = await connection.query(sql, [id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido, id]);

            return result; // Retorna resultado do update
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Deleta um pedido pelo ID.
     * 
     * @async
     * @function deletarPedido
     * @param {number} pId - ID do pedido que será removido.
     * @returns {Promise<Object>} Retorna dados da operação (affectedRows).
     */
    async deletarPedido(pId) {
        const connection = await pool.getConnection(); // Abre conexão
        try {
            // Verifica se o pedido existe
            const [pedidoExistente] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ?', [pId]);

            // Se não existir, retorna como não removido
            if (pedidoExistente.length === 0) {
                return { affectedRows: 0 };
            }

            // Remove o pedido
            const [result] = await connection.query('DELETE FROM pedidos WHERE id_pedido = ?', [pId]);

            return result; // Retorna resultado da exclusão
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Verifica quantas entregas estão vinculadas ao pedido.
     * (Usado antes de excluir para evitar erro de FK)
     * 
     * @async
     * @function verificarPedidosVinculados
     * @param {number} idPedido - ID do pedido a ser verificado.
     * @returns {Promise<number>} Quantidade de entregas vinculadas.
     */
    async verificarPedidosVinculados(idPedido) {
        const connection = await pool.getConnection();

        try {
            const sql = 'SELECT COUNT(*) AS total FROM entregas WHERE id_pedido = ?';

            const [linhas] = await connection.query(sql, [idPedido]);

            // Retorna somente o valor total
            return linhas[0].total;

        } catch (error) {
            await connection.rollback();
            throw error; // dispara o erro para o controller tratar

        }
    }
};

module.exports = { pedidoModel };
