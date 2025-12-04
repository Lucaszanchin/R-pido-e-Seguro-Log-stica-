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
        // Abre uma conexão com o banco (modo manual)

        try {
            const [rows] = await connection.query('SELECT * FROM entregas');
            // Executa a consulta SQL para buscar todas as entregas

            return rows;
            // Retorna todas as linhas encontradas

        } catch (error) {
            await connection.rollback();
            // Cancela qualquer operação pendente em caso de erro

            throw error;
            // Repassa o erro para ser tratado no controller
        }
    },

    async buscarPorId(id) {
        const connection = await pool.getConnection(); // Abre conexão
        try {
            // Executa select por ID
            const [rows] = await connection.query('SELECT * FROM entregas WHERE id_entrega = ?', [id]);

            // Retorna somente a primeira linha (ou undefined)
            return rows[0];

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
        // Cria uma nova conexão com o banco              

        try {
            const [rows] = await connection.query(
                'SELECT * FROM entregas WHERE id_pedido = ?',
                [id_pedido]
            );
            // Consulta entregas filtrando pelo ID do pedido

            return rows;
            // Retorna array de entregas encontradas

        } catch (error) {
            await connection.rollback();
            // Cancela possível transação

            throw error;
            // Permite que o controller trate o erro
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
        // Abre conexão com o banco

        try {
            const sql = `INSERT INTO entregas (id_pedido, valorDistancia_entrega, valorPeso_entrega, acrescimo_entrega, desconto_entrega, taxaAdicional_entrega, valorFinal_entrega, status_entrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           `;
            // Comando SQL para inserir uma nova entrega

            const [result] = await connection.query(sql, [entrega.id_pedido, entrega.valorDistancia_entrega, entrega.valorPeso_entrega, entrega.acrescimo_entrega, entrega.desconto_entrega, entrega.taxaAdicional_entrega, entrega.valorFinal_entrega, entrega.status_entrega || 'calculado']);
            // Define status padrão caso não seja enviado

            return { id: result.insertId };
            // Retorna o ID da entrega criada

        } catch (error) {
            await connection.rollback();
            // Cancela qualquer operação pendente

            throw error;
            // Joga o erro para o controller
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
        // Abre conexão com o banco

        try {
            const [result] = await connection.query('UPDATE entregas SET status_entrega = ? WHERE id_entrega = ?', [status, id_entrega]
            );
            // Executa o update com os novos valores

            return result.affectedRows > 0;
            // Retorna true se alguma linha foi alterada

        } catch (error) {
            await connection.rollback();
            // Cancela transação em caso de erro

            throw error;
            // Repasse do erro para ser tratado posteriormente
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
        // Obtém a conexão com o banco

        try {
            const [result] = await connection.query('DELETE FROM entregas WHERE id_entrega = ?', [pId]);
            // Executa a remoção da entrega

            return result;
            // Retorna o resultado da operação do MySQL

        } catch (error) {
            await connection.rollback();
            // Cancela operação pendente em caso de erro

            throw error;
            // Joga o erro para o controller lidar
        }
    },

    /**
 * Atualiza os dados de uma entrega existente no banco de dados.
 * 
 * @async
 * @function atualizarEntrega
 * @param {number} id_pedido - ID do pedido vinculado à entrega.
 * @param {number} valorDistancia_entrega - Valor calculado pela distância.
 * @param {number} valorPeso_entrega - Valor calculado pelo peso.
 * @param {number} acrescimo_entrega - Valor adicional aplicado.
 * @param {number} desconto_entrega - Desconto aplicado.
 * @param {number} taxaAdicional_entrega - Taxa adicional aplicada.
 * @param {number} valorFinal_entrega - Valor final da entrega.
 * @param {number} id_entrega - ID da entrega que será atualizada.
 * @returns {Promise<Object>} Retorna o resultado da atualização (affectedRows, etc.).
 * @throws Lança erro caso ocorra falha na query ou na transação.
 */
    async atualizarEntrega(id_pedido, valorDistancia_entrega, valorPeso_entrega, acrescimo_entrega, desconto_entrega, taxaAdicional_entrega, valorFinal_entrega, id_entrega) {
        const connection = await pool.getConnection();

        try {
            const sql = `
            UPDATE entregas 
            SET id_pedido = ?, valorDistancia_entrega = ?, valorPeso_entrega = ?, acrescimo_entrega = ?, desconto_entrega = ?, taxaAdicional_entrega = ?, valorFinal_entrega = ? WHERE id_entrega = `;

            const [result] = await connection.query(sql, [id_pedido, valorDistancia_entrega, valorPeso_entrega, acrescimo_entrega, desconto_entrega, taxaAdicional_entrega, valorFinal_entrega, id_entrega]);

            return result;

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
};


module.exports = { entregaModel };
