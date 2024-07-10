const {pool} = require('../db.js');

async function obtenerUsuarios() {
    try {
        const result = await pool.query(`
            SELECT * FROM sm_usuario;
        `);
        return result.rows;
    } catch (error) {
        console.error('Error en la consulta:', error);
        return error;
    }
}

module.exports = { obtenerUsuarios };