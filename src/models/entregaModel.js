const pool = require('../config/db');

const entregaModel = {

    /**
     * Lista todas as entregas cadastradas no sistema.
     * @async
     * @function
     * @returns {Promise<Array>} Retorna um array com todas as entregas.
     */
    async listarTodas() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM entregas');
            return rows;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Busca entregas vinculadas a um pedido específico.
     * @async
     * @function
     * @param {number} id_pedido - ID do pedido para consulta.
     * @returns {Promise<Array>} Retorna um array de entregas relacionadas ao pedido.
     */
    async buscarPorPedido(id_pedido) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM entregas WHERE id_pedido = ?',
                [id_pedido]
            );
            return rows;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Cria uma nova entrega no banco de dados.
     * @async
     * @function
     * @param {Object} entrega - Objeto contendo os dados da entrega.
     * @param {number} entrega.id_pedido - ID do pedido vinculado.
     * @param {number} entrega.valorDistancia_entrega - Valor calculado pela distância.
     * @param {number} entrega.valorPeso_entrega - Valor calculado pelo peso.
     * @param {number} entrega.acrescimo_entrega - Valor adicional aplicado.
     * @param {number} entrega.desconto_entrega - Desconto aplicado.
     * @param {number} entrega.taxaAdicional_entrega - Taxa extra (ex.: entrega expressa).
     * @param {number} entrega.valorFinal_entrega - Valor total final da entrega.
     * @param {string} [entrega.status_entrega='calculado'] - Status inicial da entrega.
     * @returns {Promise<Object>} Retorna o ID da nova entrega criada.
     */
    async criarEntrega(entrega) {
        const connection = await pool.getConnection();
        try {
            const sql = `
                INSERT INTO entregas (
                    id_pedido,
                    valorDistancia_entrega,
                    valorPeso_entrega,
                    acrescimo_entrega,
                    desconto_entrega,
                    taxaAdicional_entrega,
                    valorFinal_entrega,
                    status_entrega
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await connection.query(sql, [
                entrega.id_pedido,
                entrega.valorDistancia_entrega,
                entrega.valorPeso_entrega,
                entrega.acrescimo_entrega,
                entrega.desconto_entrega,
                entrega.taxaAdicional_entrega,
                entrega.valorFinal_entrega,
                entrega.status_entrega || 'calculado'
            ]);

            return { id: result.insertId };
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Atualiza o status de uma entrega específica.
     * @async
     * @function
     * @param {number} id_entrega - ID da entrega.
     * @param {string} status - Novo status (ex.: 'calculado', 'em_transito', 'entregue').
     * @returns {Promise<boolean>} Retorna true caso a entrega tenha sido atualizada.
     */
    async atualizarStatus(id_entrega, status) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'UPDATE entregas SET status_entrega = ? WHERE id_entrega = ?',
                [status, id_entrega]
            );
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    /**
     * Deleta uma entrega pelo ID.
     * @async
     * @function
     * @param {number} pId - ID da entrega a ser removida.
     * @returns {Promise<Object>} Resultado da operação de delete.
     */
    async deletarEntrega(pId) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'DELETE FROM entregas WHERE id_entrega = ?',
                [pId]
            );
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
};

module.exports = { entregaModel };
