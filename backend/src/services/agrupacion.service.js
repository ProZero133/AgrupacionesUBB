const { pool } = require('../db.js');

async function getAgrupaciones() {
   try{
    // Obtiene todas las agrupaciones
    const agrupaciones = await pool.query('SELECT * FROM "Agrupacion"');
    // Retorna las agrupaciones
    return agrupaciones.rows;
   }
    catch (error) {
      console.log('Error al obtener las agrupaciones:', error);
  }
}
  async function getAgrupacionById(id) {
    try {
      // Obtiene la agrupacion con el id especificado
      const agrupacion = await pool.query('SELECT * FROM "Agrupacion" WHERE id_agr = $1', [id]);
  
      // Retorna la agrupacion
      return agrupacion;
    } catch (error) {
      // Maneja cualquier error que pueda ocurrir
      console.error('Error al obtener la agrupación:', error);
      throw error;
    }
  }

  async function createAgrupacion(agrupacion) {
    try {
        // Inserta una nueva agrupacion en la base de datos
        const newAgrupacion = await pool.query(
            'INSERT INTO "Agrupacion" (nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [agrupacion.nombre_agr, agrupacion.descripcion, agrupacion.rut, agrupacion.fecha_creacion, agrupacion.verificado, agrupacion.fecha_verificacion]
        );

        // Retorna la nueva agrupacion insertada
        return newAgrupacion.rows[0];
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la agrupación:', error);
        throw error;
    }
}

  async function updateAgrupacion(id, agrupacion) {
    try {
      // Actualiza la agrupacion con el id especificado
      const [rowsUpdated, [updatedAgrupacion]] = await Agrupacion.update({
        id_agr: agrupacion.id_agr,
        nombre_agr: agrupacion.nombre_agr,
        descripcion: agrupacion.descripcion,
        rut: agrupacion.rut,
        fecha_creacion: agrupacion.fecha_creacion,
        verificado: agrupacion.verificado,
        fecha_verificacion: agrupacion.fecha_verificacion
      }, {
        where: { id: id },
        returning: true
      });
  
      // Retorna la agrupacion actualizada
      return updatedAgrupacion;
    } catch (error) {
      // Maneja cualquier error que pueda ocurrir
      console.error('Error al actualizar la agrupación:', error);
      throw error;
    }
  }

  module.exports = {
    getAgrupaciones,
    getAgrupacionById,
    createAgrupacion,
    updateAgrupacion
  };