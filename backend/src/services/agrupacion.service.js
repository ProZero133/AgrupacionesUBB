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

  async function getImage(id) {
    try {
      // Obtiene la imagen con el id especificado
      const imagen = await pool.query('SELECT * FROM "Imagenes" WHERE id_imagen = $1', [id]);
      const imageData = imagen.rows[0].imagen;
      return imageData;
    } catch (error) {
      // Maneja cualquier error que pueda ocurrir
      console.error('Error al obtener la imagen:', error);
      throw error;
    }

  }
  async function createSolicitud(rut, id_agr) {
    try {
      // Crea una nueva solicitud
    const rol_agr = 'Pendiente';
    const response = await pool.query('INSERT INTO "Pertenece" (rut, id_agr, rol_agr) VALUES ($1, $2, $3) RETURNING *', [rut, id_agr, rol_agr]);
    return response.rows[0];
    }
    catch (error) {
      console.log('Error al crear la solicitud:', error);
    }
  }
  async function getSolicitudes(id_agr) {
    try {
      // Obtiene todas las solicitudes de la agrupacion
      const solicitudes = await pool.query('SELECT * FROM "Pertenece" WHERE id_agr = $1 AND rol_agr = $2', [id_agr, 'Pendiente']);
      return solicitudes.rows;
    } catch (error) {
      console.log('Error al obtener las solicitudes:', error);
    }
  }
  async function updateSolicitud(rut, id_agr) {
    try{
      // Actualiza la solicitud con el rut y id_agr especificados
      const validarSolicitud = await pool.query('SELECT * FROM "Pertenece" WHERE rut = $1 AND id_agr = $2', [rut, id_agr]);
      if (validarSolicitud.rows[0].rol_agr === 'Miembro') {
        return 'El usuario ya es miembro de la agrupación';
      }
      //Si no existe la solicitud
      else if(validarSolicitud.rows[0] < 0)
        {
          return 'No existe la solicitud';
        }
        const fecha_ingreso = new Date();
      const response = await pool.query('UPDATE "Pertenece" SET rol_agr = $1, fecha_integracion = $2 WHERE rut = $3 AND id_agr = $4 RETURNING *', ['Miembro',fecha_ingreso, rut, id_agr]);
      return response.rows[0];
    }
    catch (error) {
      console.log('Error al actualizar la solicitud:', error);
  }
}

  module.exports = {
    getAgrupaciones,
    getAgrupacionById,
    createAgrupacion,
    updateAgrupacion,
    getImage,
    createSolicitud,
    getSolicitudes,
    updateSolicitud
  };