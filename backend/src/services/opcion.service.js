const { pool } = require('../db.js');
const { getVotacionById } = require('./votacion.service.js');

async function getOpciones() {
    try {
        const opciones = await pool.query('SELECT * FROM "Opcion"');
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
        const votacion = await getVotacionById(opcionData.id_votacion);
        if (!votacion) {
            throw new Error('La votación con el ID especificado no existe');
        }
        //Arma la consulta SQL para insertar una opcion
        console.log("weas insertadas");
        console.log(opcionData);
        const newOpcion = await pool.query('INSERT INTO "Opcion" (nombre, respuestas, id_votacion) VALUES ($1, $2, $3) RETURNING *', [opcionData.nombre, 0, opcionData.id_votacion]);
        return newOpcion.rows[0];

    } catch (error) {
        console.error('Error al insertar la opcion:', error);
        throw error;
    }
}

async function updateOpcion(id, opcionData) {
    try {
        const { nombre, resultado } = opcionData;
        const updateOpcion = await pool.query('UPDATE "Opcion" SET nombre = $1, resultado = $2 WHERE id = $3 RETURNING *', [opcionData.nombre, opcionData.resultado, id]);
        return updateOpcion.rows[0];
    } catch (error) {
        console.error(error);
    }
}

async function deleteOpcion(id) {
    try {
        await pool.query('DELETE FROM "Opcion" WHERE id = $1', [id]);
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