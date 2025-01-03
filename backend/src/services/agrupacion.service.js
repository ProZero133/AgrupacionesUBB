const { pool } = require('../db.js');
const { getUsuarioByRut } = require('../services/user.service.js');
const { obtenerAdministradoresPlataforma } = require('../services/admin.service.js');
const { notifySolicitudAcritacion } = require('../services/mail.service.js');
const axios = require('axios');
const config = require('../config/configEnv.js');
const API_ConectaUBB = config.API_ConectaUBB;

async function getAgrupaciones() {
  try {
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
    return agrupacion.rows[0];

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
      'INSERT INTO "Agrupacion" (nombre_agr, descripcion, rut, fecha_creacion, verificado, fecha_verificacion, visible, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [agrupacion.nombre_agr, agrupacion.descripcion, agrupacion.rut, fechaActual, agrupacion.verificado, agrupacion.fecha_verificacion, visible, agrupacion.imagen]
    );
    //Insertar lider de la agrupacion
    const lider = await pool.query('INSERT INTO "Pertenece" (rut, id_agr, fecha_integracion, rol_agr) VALUES ($1, $2, $3, $4) RETURNING *', [agrupacion.rut, newAgrupacion.rows[0].id_agr, fechaActual, 'Lider']);
    if (lider.rows.length === 0) {
      throw new Error('Error al insertar el lider');
    }

    
      const BordeDescripcion = '20px';
      const FondoDescripcion = '#FFFFFF';
      const SombraDescripcion = '0|6|12|rgba(0, 0, 0, 0.2)'
      const BordeActividades = '20px';
      const FondoActividades = '#FFFFFF';
      const SombraActividades = '0|6|12|rgba(0, 0, 0, 0.2)'
    

    const apariencia = await pool.query('INSERT INTO "Apariencia" (id_agr, bordedescripcion, fondodescripcion, sombradescripcion, bordeactividad, fondoactividad, sombraactividad) VALUES ($1, $2,$3,$4,$5,$6,$7) RETURNING *', [newAgrupacion.rows[0].id_agr, BordeDescripcion, FondoDescripcion, SombraDescripcion, BordeActividades, FondoActividades, SombraActividades]);
    // Retorna la nueva agrupacion insertada
    return newAgrupacion.rows[0];
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir
    console.error('Error al insertar la agrupación:', error);
    throw error;
  }
}

async function createSolicitarAcreditacion(id_agr, rut) {
  try {
    const agrupacion = await getAgrupacionById(id_agr);
    const usuario = await getUsuarioByRut(rut);
    const nombre = usuario.nombre;
    const ListaAdministradores = await obtenerAdministradoresPlataforma();
    // Obtener correo de los administradores desde API ConectaUBB
    for (let i = 0; i < ListaAdministradores.length; i++) {
      const response = await axios.post(`${API_ConectaUBB}/usuariosRut`, {
        rut: ListaAdministradores[i].rut
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      ListaAdministradores[i].correo = response.data.recordsets[0][0].correo;
    }
    if (!agrupacion) {
      return 'La agrupación no existe';
    }

    if (!usuario) {
      return 'El usuario no existe';
    }

    if (agrupacion.rut !== rut) {
      return 'El usuario no es el lider de la agrupación';
    }

    if (agrupacion.verificado === 'Verificado') {
      return 'La agrupación ya está verificada';
    }

    if (agrupacion.verificado === 'Pendiente') {
      return 'La agrupación ya solicitó la acreditación';
    }

    const NuevosDatosAgrupacion = await pool.query(
      `UPDATE "Agrupacion" SET verificado = $1, fecha_verificacion = CURRENT_TIMESTAMP WHERE id_agr = $2 RETURNING *`,
      [
        'Pendiente',
        id_agr
      ]
    );
    // Notificar a los administradores
    for (let i = 0; i < ListaAdministradores.length; i++) {
      const notificacion = {
        nombre: nombre,
        correo: ListaAdministradores[i].correo,
        agrupacion: agrupacion.nombre_agr,
      };
      const notifica = await notifySolicitudAcritacion(notificacion);
    }
    // Retorna la agrupación actualizada
    return NuevosDatosAgrupacion.rows[0];
  } catch (error) {
    console.log('Error al solicitar la acreditación:', error);
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

async function updateAgrupacionNoVerificado(id) {
  try {

    // Actualiza solo el atributo verificado
    const update_Verificado = await pool.query(
      `UPDATE "Agrupacion" 
       SET verificado = $1, fecha_verificacion = CURRENT_TIMESTAMP 
       WHERE id_agr = $2 
       RETURNING *`,
      [
        'Noverificado',
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

async function getUsuariosdeAgrupacion(id) {
  try {
    // Obtiene los usuarios de la agrupación con el id especificado donde el rol sea distinto de 'Pendiente'
    const usuariosPlataforma = await pool.query('SELECT * FROM "Pertenece" WHERE id_agr = $1 AND rol_agr != $2', [id, 'Pendiente']);
    for (let i = 0; i < usuariosPlataforma.rows.length; i++) {
      const usuario = await getUsuarioByRut(usuariosPlataforma.rows[i].rut);
      usuariosPlataforma.rows[i].user_nombre = usuario.nombres.split(' ')[0] + ' ' + usuario.primer_apellido;
      usuariosPlataforma.rows[i].agrupacion_id = usuariosPlataforma.rows[i].id_agr;
      usuariosPlataforma.rows[i].correo = usuario.correo;
    }
    return usuariosPlataforma.rows;
  } catch (error) {
    console.log('Error al obtener los usuarios de la agrupación:', error);
  }
}

async function getRolUsuario(rut, id_agr) {
  try {
    // Obtiene el rol del usuario con el rut y id_agr especificados
    const rol = await pool.query('SELECT * FROM "Pertenece" WHERE rut = $1 AND id_agr = $2', [rut, id_agr]);
    return rol.rows[0];
  } catch (error) {
    console.log('Error al obtener el rol del usuario:', error);
  }
}

async function updateRolUsuario(rut, id_agr, rol) {
  try {
    // Actualiza el rol del usuario con el rut y id_agr especificados
    const response = await pool.query('UPDATE "Pertenece" SET rol_agr = $1 WHERE rut = $2 AND id_agr = $3 RETURNING *', [rol, rut, id_agr]);
    return response.rows[0];
  } catch (error) {
    console.log('Error al actualizar el rol del usuario:', error);
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

async function createInvitacion(invitacion) {
  try {
    // Crea una nueva solicitud
    const response = await pool.query('INSERT INTO "Pertenece" (rut, id_agr, fecha_integracion, rol_agr) VALUES ($1, $2, $3, $4) RETURNING *',
      [invitacion.rut, invitacion.id_agr, invitacion.fecha_integracion, invitacion.rol_agr]);
    return response.rows[0];
  }
  catch (error) {
    console.log('Error al crear la invitacion:', error);
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
  try {
    // Actualiza la solicitud con el rut y id_agr especificados
    const validarSolicitud = await pool.query('SELECT * FROM "Pertenece" WHERE rut = $1 AND id_agr = $2', [rut, id_agr]);
    if (validarSolicitud.rows[0].rol_agr === 'Miembro') {
      return 'El usuario ya es miembro de la agrupación';
    }
    //Si no existe la solicitud
    else if (validarSolicitud.rows[0] < 0) {
      return 'No existe la solicitud';
    }
    const fecha_ingreso = new Date();
    const response = await pool.query('UPDATE "Pertenece" SET rol_agr = $1, fecha_integracion = $2 WHERE rut = $3 AND id_agr = $4 RETURNING *', ['Miembro', fecha_ingreso, rut, id_agr]);
    return response.rows[0];
  }
  catch (error) {
    console.log('Error al actualizar la solicitud:', error);
  }
}

async function deleteAgrupacion(id_agr) {
  try {
    // Elimina las actividades asociadas a la agrupación
    const idactByAgr = await pool.query('SELECT id_act FROM "Actividad" WHERE id_agr = $1', [id_agr]);
    const actividadesIds = idactByAgr.rows.map(row => row.id_act);

    // Elimina las participaciones asociadas a las actividades
    for (const id_act of actividadesIds) {
      await pool.query('DELETE FROM "Participa" WHERE id_act = $1', [id_act]);
    }

    // Elimina los programas de la agrupación
    await pool.query('DELETE FROM "Programa" WHERE id_agr = $1', [id_agr]);

    // Elimina las actividades de la agrupación
    await pool.query('DELETE FROM "Actividad" WHERE id_agr = $1', [id_agr]);
    // Primero, toma todas las publicaciones cuya id_agr sea igual a la id_agr de la agrupación, y guardamos sus id_pub en un array
    // Luego, elimina todas los posts, formularios y opciones asociadas a las publicaciones
    // Finalmente, elimina las publicaciones

    const idpubByAgr = await pool.query('SELECT id_pub FROM "Publicacion" WHERE id_agr = $1', [id_agr]);
    const publicacionesIds = idpubByAgr.rows.map(row => row.id_pub);

    for (const id_pub of publicacionesIds) {
      await pool.query('DELETE FROM "Post" WHERE id_pub = $1', [id_pub]);
      await pool.query('DELETE FROM "Formulario" WHERE id_pub = $1', [id_pub]);
    }

    await pool.query('DELETE FROM "Publicacion" WHERE id_agr = $1', [id_agr]);

    await pool.query('DELETE FROM "Pertenece" WHERE id_agr = $1', [id_agr]);

    await pool.query('DELETE FROM "Agrupacion_tags" WHERE id_agr = $1', [id_agr]);
    // Finalmente, elimina la agrupación
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
    // Establece la visibilidad de las actividades en falso
    const actividades = await pool.query('UPDATE "Actividad" SET visible = $1 WHERE id_agr = $2 RETURNING *', [false, id_agr]);
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

async function getLiderArray(id_agr) {
  try {
    // Obtiene el lider de la agrupacion
    const lider = await pool.query('SELECT * FROM "Pertenece" WHERE id_agr = $1 AND rol_agr = $2', [id_agr, 'Lider']);
    return lider.rows;
  } catch (error) {
    console.log('Error al obtener el lider:', error);
  }
}

async function validateEliminarGrupo(id_agr) {
  try {

    const agrupacion = await softDeleteAgrupacion(id_agr);
    if (agrupacion.length === 0) {
      return 'Error al eliminar la agrupación';
    }
    return 'Agrupacion eliminada';
  }
  catch (error) {
    console.log('Error al obtener las actividades:', error);
  }
}

async function getAgrupacionesDeUsuario(rut) {
  try {
    // Obtiene las agrupaciones del usuario con el rut especificado
    const agrupaciones = await pool.query('SELECT * FROM "Pertenece" WHERE rut = $1', [rut]);
    // Listado de agrupaciones del usuario
    let agrupacionesUsuario = [];
    for (let i = 0; i < agrupaciones.rows.length; i++) {
      const agrupacion = await pool.query('SELECT * FROM "Agrupacion" WHERE id_agr = $1 AND visible = TRUE', [agrupaciones.rows[i].id_agr]);
      if (agrupacion.rows.length > 0) {
        agrupacionesUsuario.push(agrupacion.rows[0]);
      }
    }
    if (agrupacionesUsuario.length === 0) {
      return 'No se encontraron agrupaciones visibles';
    }
    return agrupacionesUsuario;
  } catch (error) {
    console.log('Error al obtener las agrupaciones del usuario:', error);
    throw error;
  }
}

async function getPertenece(rut) {
  try {
    // Obtiene la relación de pertenencia del usuario con el rut y id_agr especificados
    const pertenece = await pool.query('SELECT * FROM "Pertenece" WHERE Rut = $1', [rut]);
    return pertenece.rows;
  } catch (error) {
    console.log('Error al obtener la relación de pertenencia:', error);
  }
}

async function deleteUsuarioAgrupacion(rut, id_agr) {
  try {
    // Elimina al usuario de la agrupación
    const usuario = await pool.query('DELETE FROM "Pertenece" WHERE rut = $1 AND id_agr = $2 RETURNING *', [rut, id_agr]);
    const miembros = await pool.query('SELECT * FROM "Pertenece" WHERE id_agr = $1 ', [id_agr]);
    if (miembros.rows.length === 0) {
      await softDeleteAgrupacion(id_agr);
      return 'Agrupacion eliminada por falta de miembros';
    }
    return 'Usuario eliminado de la agrupación';
  } catch (error) {
    console.log('Error al eliminar el usuario de la agrupación:', error);
  }
}

async function rejectSolicitud(rut, id_agr) {
  try {
    // Rechaza la solicitud con el rut y id_agr especificados
    const response = await pool.query('DELETE FROM "Pertenece" WHERE rut = $1 AND id_agr = $2 RETURNING *', [rut, id_agr]);
    return response.rows[0];
  } catch (error) {
    console.log('Error al rechazar la solicitud:', error);
  }
}

async function updateAgrupacion(id_agr, agrupacion, rut, imagen) {
  try {
    // Actualiza la agrupación con el id especificado
    const NuevosDatosAgrupacion = await pool.query(
      `UPDATE "Agrupacion" SET nombre_agr = $1, descripcion = $2, rut = $3 WHERE id_agr = $4 RETURNING *`,
      [agrupacion.nombre_agr, agrupacion.descripcion, rut, id_agr]
    );

    // Retorna la agrupación actualizada
    return NuevosDatosAgrupacion.rows[0];
  }
  catch (error) {
    console.log('Error al actualizar la agrupación:', error);
  }
}

async function insertTagsAgrupacion(id_agr, tags) {
  try {
    const response = await pool.query('INSERT INTO "Agrupacion_tags" (id_agr, id_tag) VALUES ($1, $2) RETURNING *', [id_agr, tags]);

    return 'Tags ingresados correctamente';
  } catch (error) {
    console.log('Error al ingresar los tags:', error);
  }
}

async function getAgrupacionesPorNombre(nombre_agr) {
  try {
    // Obtiene las agrupaciones con el nombre especificado (búsqueda no exacta)
    const agrupaciones = await pool.query('SELECT * FROM "Agrupacion" WHERE nombre_agr ILIKE $1', [`%${nombre_agr}%`]);
    return agrupaciones.rows;
  } catch (error) {
    console.log('Error al obtener las agrupaciones:', error);
  }
}

async function getPublicacionCorreos(id_agr, id_pub) {
  try {
    const perteneceResult = await pool.query('SELECT rut FROM "Pertenece" WHERE id_agr = $1', [id_agr]);
    const ruts = perteneceResult.rows.map(row => row.rut);

    const correos = [];
    for (const rut of ruts) {
      const response = await axios.post(`${API_ConectaUBB}/usuariosRut`, {
        rut: rut
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.data.recordsets > 0) {
        correos.push(response.data.recordsets[0][0].correo);
      }
    };

    return correos;
  } catch (error) {
    console.error('Error al notificar a los miembros de la publicación:', error);
  }
}

async function redeemCodigo(rut, id_agr) {
  try {
    const fecha_ingreso = new Date();
    const response = await pool.query('INSERT INTO "Pertenece" (rut, id_agr, fecha_integracion, rol_agr) VALUES ($1, $2, $3, $4) RETURNING *', [rut, id_agr, fecha_ingreso, 'Miembro']);
    if (response.rows.length === 0) {
      return [];
    }
    return response.rows[0];
  } catch (error) {
    console.error('Error al canjear el código de invitación:', error);
  }
}

async function getAgrupacionesNoInscritas(rut) {
  try {
    // Obtiene las agrupaciones que no están inscritas por el usuario con el rut especificado
    const agrupaciones = await pool.query('SELECT * FROM "Agrupacion" WHERE id_agr NOT IN (SELECT id_agr FROM "Pertenece" WHERE rut = $1)', [rut]);
    return agrupaciones.rows;
  } catch (error) {
    console.log('Error al obtener las agrupaciones no inscritas:', error);
  }
}

async function getTagsAgrupacion(id_agr) {
  try {
    // Obtiene los tags de la agrupación con el id especificado
    const tags = await pool.query('SELECT * FROM "Agrupacion_tags" WHERE id_agr = $1', [id_agr]);
    return tags.rows;
  } catch (error) {
    console.log('Error al obtener los tags de la agrupación:', error);
  }
}

async function deleteTagAgrupacion(id_agr, id_tag) {
  try {
    // Elimina el tag de la agrupación
    const response = await pool.query('DELETE FROM "Agrupacion_tags" WHERE id_agr = $1 AND id_tag = $2 RETURNING *', [id_agr, id_tag]);
    return 'Tag eliminado de la agrupación';
  } catch (error) {
    console.log('Error al eliminar el tag de la agrupación:', error);
  }
}

async function getAparienciaAgrupacion(id_agr) {
  try {
    // Obtiene la apariencia de la agrupación con el id especificado
    const apariencia = await pool.query('SELECT * FROM "Apariencia" WHERE id_agr = $1', [id_agr]);
    return apariencia.rows[0];
  } catch (error) {
    console.log('Error al obtener la apariencia de la agrupación:', error);
  }
}

async function updateAparienciaAgrupacion(id_agr, apariencia) {
  try {
    const {
      BordeDescripcion,
      FondoDescripcion,
      SombraDescripcion,
      BordeActividades,
      FondoActividades,
      SombraActividades,
    } = apariencia;

    const sombraDescripcion = SombraDescripcion.join('|');
    const sombraActividades = SombraActividades.join('|');
    const response = await pool.query(
      `UPDATE "Apariencia" SET "bordedescripcion" = $1, "fondodescripcion" = $2, "sombradescripcion" = $3, "bordeactividad" = $4, "fondoactividad" = $5, "sombraactividad" = $6 
       WHERE "id_agr" = $7 
       RETURNING *`,
      [
        BordeDescripcion,
        FondoDescripcion,
        sombraDescripcion,
        BordeActividades,
        FondoActividades,
        sombraActividades,
        id_agr,
      ]
    );
    return response.rows[0];
  } catch (error) {
    console.log('Error al actualizar la apariencia de la agrupación:', error);
  }
}

async function updateRedesSociales(id_gr, req) {
  try {
      const facebook = req.fb;
      const instagram = req.ig;
      const twitter = req.tw;
      const id_agr = id_gr;
      // Actualiza las redes sociales de la agrupación en la base de datos
      const response = await pool.query(
          `UPDATE "Apariencia" SET enlace_fb = $1, enlace_ig = $2, enlace_tw = $3 WHERE id_agr = $4 RETURNING *`,
          [facebook, instagram, twitter, id_agr]
      );
      if (!response) {
          return [];
      }
      return response.rows[0];
  } catch (error) {
      console.error('Error al programar la actividad:', error);
  }
}

module.exports = {
  getAgrupaciones,
  getAgrupacionById,
  createAgrupacion,
  createSolicitarAcreditacion,
  getUsuariosdeAgrupacion,
  getRolUsuario,
  updateRolUsuario,
  updateAgrupacionVerificado,
  updateAgrupacionNoVerificado,
  getImage,
  createSolicitud,
  getSolicitudes,
  updateSolicitud,
  deleteAgrupacion,
  getLider,
  getLiderArray,
  validateEliminarGrupo,
  getAgrupacionesDeUsuario,
  getPertenece,
  deleteUsuarioAgrupacion,
  rejectSolicitud,
  updateAgrupacion,
  insertTagsAgrupacion,
  getAgrupacionesPorNombre,
  getPublicacionCorreos,
  createInvitacion,
  redeemCodigo,
  getAgrupacionesNoInscritas,
  getTagsAgrupacion,
  deleteTagAgrupacion,
  getAparienciaAgrupacion,
  updateAparienciaAgrupacion,
  updateRedesSociales,
};