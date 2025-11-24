const pool = require('../config/db');

const pedidoModel = {
  async criarPedido(pedido) {
    const connection = await pool.getConnection();
    try {
      const sql = `INSERT INTO pedidos (id_cliente, data_pedido, tipoEntrega_pedido, pesoKg_pedido, distanciaKm_pedido, valoBaseKm_pedido, valorBaseKg_pedido) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await connection.query(sql, [pedido.id_cliente, pedido.data_pedido, pedido.tipoEntrega_pedido, pedido.pesoKg_pedido, pedido.distanciaKm_pedido, pedido.valoBaseKm_pedido, pedido.valorBaseKg_pedido]);
      return { id: result.insertId };
    } finally {
      connection.release();
    }
  },

  async buscarPorId(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
      return rows[0];
    } finally {
      connection.release();
    }
  },

  async listarTodosPedidos() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM pedidos');
      return rows;
    } finally {
      connection.release();
    }
  }
};

module.exports = { pedidoModel };
