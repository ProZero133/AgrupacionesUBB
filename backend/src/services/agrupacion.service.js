const { pool } = require('../db.js');
const {getActividadesByAgrupacion, getFechasActividades, getParticipantesActividad} = require('../services/actividad.service.js');

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
      const fechaActual = new Date();
      const visible = true;
        // Inserta una nueva agrupacion en la base de datos
        const newAgrupacion = await pool.query(
            'INSERT INTO "Agrupacion" (nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion, visible) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [agrupacion.nombre_agr, agrupacion.descripcion, agrupacion.rut, fechaActual, agrupacion.verificado, agrupacion.fecha_verificacion, visible]
        );
        //Insertar lider de la agrupacion
        const lider = await pool.query('INSERT INTO "Pertenece" (rut, id_agr, fecha_integracion, rol_agr) VALUES ($1, $2, $3, $4) RETURNING *', [agrupacion.rut, newAgrupacion.rows[0].id_agr, fechaActual, 'Lider']);
        if (lider.rows.length === 0) {
          return 'Error al insertar el lider';
        }
        // Retorna la nueva agrupacion insertada
        return newAgrupacion.rows[0];
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la agrupación:', error);
        throw error;
    }
}

// wachito, esto no funciona y me taime asi que voy a hacer uno unica y explusivamente para el verificado
async function updateAgrupacion(id) {
  try {
    // Verifica si la agrupación existe
    const validarAgrupacion = await pool.query('SELECT * FROM "Agrupaciones" WHERE id = $1', [id]);
    
    if (validarAgrupacion.rows.length === 0) {
      return 'La agrupación no existe';
    }

    // Actualiza la agrupación con el id especificado
    const NuevosDatosAgrupacion = await pool.query(
      `UPDATE "Agrupacion" SET id_agr = $1, nombre_agr = $2, descripcion = $3, rut = $4, fecha_creacion = $5, verificado = $6, fecha_verificacion = $7 WHERE id = $8 RETURNING *`, 
      [agrupacion.id_agr, agrupacion.nombre_agr, agrupacion.descripcion, agrupacion.rut, agrupacion.fecha_creacion, agrupacion.verificado, agrupacion.fecha_verificacion, id]
    );

    // Retorna la agrupación actualizada
    return NuevosDatosAgrupacion.rows[0];
  } catch (error) {
    console.log('Error al actualizar la agrupación:', error);
    throw error;
  }
}


async function updateAgrupacionVerificado(id) {
  try {

    // Actualiza solo el atributo verificado
    const update_Verificado = await pool.query(
      `UPDATE "Agrupacion" 
       SET verificado = $1, fecha_verificacion = CURRENT_TIMESTAMP 
       WHERE id_agr = $2 
       RETURNING *`, 
      [
        'Verificado',
        id
      ]
    );

    // Retorna la agrupación actualizada
    return update_Verificado.rows[0];
  } catch (error) {
    console.log('Error al actualizar la agrupación:', error);
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

async function deleteAgrupacion(id_agr) {
  try {
    // Elimina la agrupación con el id especificado
    const agrupacion = await pool.query('DELETE FROM "Agrupacion" WHERE id_agr = $1 RETURNING *', [id_agr]);
    return agrupacion.rows[0];
  } catch (error) {
    console.log('Error al eliminar la agrupación:', error);
  }
}

async function softDeleteAgrupacion(id_agr) {
  try {
    // Establece la visibilidad de la agrupación en falso
    const agrupacion = await pool.query('UPDATE "Agrupacion" SET visible = $1 WHERE id_agr = $2 RETURNING *', [false, id_agr]);
    return agrupacion.rows[0];
  } catch (error) {
    console.log('Error al eliminar la agrupación:', error);
  }
}

async function getLider(id_agr) {
  try {
    // Obtiene el lider de la agrupacion
    const lider = await pool.query('SELECT * FROM "Pertenece" WHERE id_agr = $1 AND rol_agr = $2', [id_agr, 'Lider']);
    return lider.rows[0];
  } catch (error) {
    console.log('Error al obtener el lider:', error);
  }
}

async function validateEliminarGrupo(id_agr) {
  try {
    // Obtiene todas las actividades de una agrupacion
    const actividades = await getActividadesByAgrupacion(id_agr);
    //Evaluar si hay actividades pasadas la fecha actual
    if(actividades.length > 0){
      const fechasActividades = await getFechasActividades(id_agr);
      const fechaActual = new Date();
      for (let i = 0; i < fechasActividades.length; i++) {
        if(fechaActual > fechasActividades[i].fecha){
          //Soft delete por ya haber organizado actividades
          const agrupacion = await softDeleteAgrupacion(id_agr);
          if(agrupacion.length === 0){
            return 'Error al eliminar la agrupación';
          }
          return 'Agrupacion eliminada para los usuarios'; 
        }
      }
    }
    if(actividades.length > 0){
      //Obtener la cantidad de participantes para cada actividad
      for (let i = 0; i < actividades.length; i++) {
        const participantes = await getParticipantesActividad(actividades[i].id_act);
        if(participantes.length > 1){
          //Soft delete por tener actividades con mas de un participante
          const agrupacion = await softDeleteAgrupacion(id_agr);
          if(agrupacion.length === 0){
            return 'Error al eliminar la agrupación';
          }
          return 'Agrupacion eliminada para los usuarios';
        }
      }
    }
    //Eliminar la agrupacion si no tiene actividades o tiene actividades con un solo participante
    const agrupacion = await deleteAgrupacion(id_agr);

    if(agrupacion.length === 0){
      return 'Error al eliminar la agrupación';
    }
    return 'Agrupacion eliminada';
  }
  catch (error) {
    console.log('Error al obtener las actividades:', error);
  }
}

  module.exports = {
    getAgrupaciones,
    getAgrupacionById,
    createAgrupacion,
    updateAgrupacion,
    updateAgrupacionVerificado,
    getImage,
    createSolicitud,
    getSolicitudes,
    updateSolicitud,
    deleteAgrupacion,
    getLider,
    validateEliminarGrupo
  };