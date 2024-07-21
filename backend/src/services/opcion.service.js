const { pool } = require('../db.js');

async function getOpciones() {
    try {
        const opciones = await pool.query('SELECT * FROM Opcion');
        return opciones.rows;
    } catch (error) {
        console.error(error);
    }
}

async function getOpcionById(id) {
    try {
        const opcion = await pool.query('SELECT * FROM Opcion WHERE id = $1', [id]);
        return opcion.rows[0];
    } catch (error) {
        console.error(error);
    }
}

async function createOpcion(opcion) {
    const { nombre, pregunta_id } = opcion;
    try {
        const newOpcion = await pool.query('INSERT INTO Opcion (nombre, pregunta_id) VALUES ($1, $2) RETURNING *', [nombre, pregunta_id]);
        return newOpcion.rows[0];
    } catch (error) {
        console.error(error);
    }
}    

async function updateOpcion(id, opcion) {
    const { nombre, pregunta_id } = opcion;
    try {
        const updatedOpcion = await pool.query('UPDATE Opcion SET nombre = $1, pregunta_id = $2 WHERE id = $3 RETURNING *', [nombre, pregunta_id, id]);
        return updatedOpcion.rows[0];
    } catch (error) {
        console.error(error);
    }
}

async function deleteOpcion(id) {
    try {
        await pool.query('DELETE FROM Opcion WHERE id = $1', [id]);
        return true;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getOpciones,
    getOpcionById,
    createOpcion,
    updateOpcion,
    deleteOpcion
}