const pool = require('../config/db');

const entregaModel = {
    async criarEntrega(entrega) {
        const connection = await pool.getConnection();
        try {
            const sql = `INSERT INTO entregas (id_pedido, valorDistancia_entrega, valorPeso_entrega, acrescimo_entrega, desconto_entrega, taxaAdicional_entrega, valorFinal_entrega, status_entrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await connection.query(sql, [entrega.id_pedido, entrega.valorDistancia_entrega, entrega.valorPeso_entrega, entrega.acrescimo_entrega, entrega.desconto_entrega, entrega.taxaAdicional_entrega, entrega.valorFinal_entrega, entrega.status_entrega || 'calculado']);
            return { id: result.insertId };
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    async buscarPorPedido(id_pedido) {
        const connection = await pool.getconnection();
        try {
            const [rows] = await connection.query('SELECT * FROM entregas WHERE id_pedido = ?', [id_pedido]);
            return rows;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    async atualizarStatus(id_entrega, status) {
        const connection = await pool.getconnection();
        try {
            const [result] = await connection.query('UPDATE entregas SET status_entrega = ? WHERE id_entrega = ?', [status, id_entrega]);
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    async listarTodas() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM entregas');
            return rows;
        } catch (error) {
            await connection.rollback();
            throw error;

        }
    }
};

module.exports = { entregaModel };
