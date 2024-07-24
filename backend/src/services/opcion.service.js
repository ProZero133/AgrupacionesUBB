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

async function createOpcion(opcionData) {
    try {
        //Arma la consulta SQL para insertar una opcion
        const newOpcion = await pool.query('INSERT INTO Opcion (nombre, resultado) VALUES ($1, $2) RETURNING *', [nombre, resultado]);
        return newOpcion.rows[0];
    } catch (error) {
        console.error(error);
    }
}    

async function updateOpcion(id, opcionData) {
    try {
        const { nombre, resultado } = opcionData;
        const updateOpcion = await pool.query('UPDATE Opcion SET nombre = $1, resultado = $2 WHERE id = $3 RETURNING *', [nombre, resultado, id]);
        return updateOpcion.rows[0];
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