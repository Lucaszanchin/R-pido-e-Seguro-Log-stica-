const pool = require('../config/db');

const pedidoModel = {

    //Insere novos pedidos
    async criarPedido(pedido) {
        const connection = await pool.getConnection();
        try {
            const sql = `INSERT INTO pedidos (id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await connection.query(sql, [pedido.id_cliente, pedido.data_pedido, pedido.tipoEntrega_pedido, pedido.pesoKg_pedido, pedido.distanciaKm_pedido, pedido.valorBaseKm_pedido, pedido.valorBaseKg_pedido]);
            return { id: result.insertId };
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    //Busca pedidos por ID
    async buscarPorId(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
            return rows[0];

        } catch (error) {

            await connection.rollback();
            throw error;
        }
    },

    //Lista todos os pedidos
    async listarTodosPedidos() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM pedidos');
            return rows;

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    //Atualiza o Pedidos
    async atualizarPedido(id, id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valorBaseKm_pedido, valorBaseKg_pedido) {
        const connection = await pool.getConnection();
        try {
            const sql = `UPDATE pedidos SET id_cliente = ?, data_pedido = ?, tipoEntrega_pedido = ?, pesoKg_pedido = ?, distanciaKm_pedido = ?, valorBaseKm_pedido = ?, valorBaseKg_pedido = ? WHERE id_pedido = ?`;

            const [result] = await connection.query(sql, [
                id_cliente,
                data_pedido,
                tipoEntrega_pedido,
                pesoKg_pedido,
                distanciaKm_pedido,
                valorBaseKm_pedido,
                valorBaseKg_pedido,
                id
            ]);

            return result;

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },


    async deletarPedido(pId) {
        const connection = await pool.getConnection();
        try {

            const [pedidoExistente] = await connection.query(
                'SELECT * FROM pedidos WHERE id_pedido = ?',
                [pId]
            );

            if (pedidoExistente.length === 0) {

                return { affectedRows: 0 };
            }

            const [result] = await connection.query(
                'DELETE FROM pedidos WHERE id_pedido = ?',
                [pId]
            );

            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },
}
module.exports = { pedidoModel };
