const { func } = require('joi');
const { pool } = require('../db.js');

async function getActividades() {
    try {
        // Obtiene todas las actividades donde la columna "tipo" es igual a False
        const actividades = await pool.query('SELECT * FROM "Actividad"');
        // Retorna las actividades
        return actividades.rows;
    }
    catch (error) {
        console.log('Error al obtener las actividades:', error);
    }
}

async function getActyAgr() {
    try {
        // Obtiene todas las actividades
        const actividades = await pool.query('SELECT * FROM "Actividad"');
        const programa = await pool.query('SELECT * FROM "Programa"');
        const agrupaciones = await pool.query('SELECT * FROM "Agrupacion"');
        // une las tablas
        const actyAgr = actividades.rows.map(act => {
            const agr = agrupaciones.rows.find(agr => agr.id_agr === act.id_agr);
            const prog = programa.rows.find(prog => prog.id_act === act.id_act);
            return {
                id_act: act.id_act,
                nom_act: act.nom_act,
                descripcion: act.descripcion,
                imagen: act.imagen,
                tipo: act.tipo,
                Aprobado: act.Aprobado,
                id_agr: act.id_agr,
                cupos: act.cupos,
                fecha_creacion: act.fecha_creacion,
                fecha_actividad: prog ? prog.fecha_actividad : null,
                nombre_agr: agr.nombre_agr,
                aprobado: act.aprobado
            }
        });
        // Retorna todos los datos
        return actyAgr;
    }
    catch (error) {
        console.log('Error al obtener las actividades:', error);
    }
}

async function getActividadesByAgrupacionActivas(id_agr) {
    try {
        // Obtiene los id_act de las actividades que aún no han ocurrido
        const programas = await pool.query(`
            SELECT id_act FROM "Programa" WHERE fecha_actividad > now()
        `);

        const id_acts = programas.rows.map(row => row.id_act);

        if (id_acts.length === 0) {
            return [];
        }

        // Obtiene los detalles de las actividades usando los id_act obtenidos
        const actividades = await pool.query(`
            SELECT * FROM "Actividad" WHERE id_agr = $1 AND id_act = ANY($2::uuid[])
        `, [id_agr, id_acts]);

        // Retorna las actividades
        return actividades.rows;
    } catch (error) {
        console.log('Error al obtener las actividades:', error);
    }
}

async function getActividadById(id) {
    try {
        // Obtiene la actividad con el id especificado de la base de datos
        const actividad = await pool.query('SELECT * FROM "Actividad" WHERE id_act = $1', [id]);

        // Retorna la actividad
        return actividad;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener la actividad:', error);
        throw error;
    }
}

async function getActividadesByAgrupacion(id_agr) {
    try {
        // Obtiene todas las actividades de una agrupacion, si la actividad es publica, solo se muestra si esta aprobada
        const actividades = await pool.query('SELECT * FROM "Actividad" WHERE id_agr = $1', [id_agr]);
        // Recorrer actividades y quitar las que sean publicas y no esten aprobadas
        for (let i = 0; i < actividades.rows.length; i++) {
            if (actividades.rows[i].tipo === true && actividades.rows[i].aprobado === false) {
                actividades.rows.splice(i, 1);
                i--;
            }
        }
        // Elimina las actividades que tengan visible en false
        for (let i = 0; i < actividades.rows.length; i++) {
            if (actividades.rows[i].visible === false) {
                actividades.rows.splice(i, 1);
                i--;
            }
        }

        // Retorna las actividades
        return actividades.rows;
    }
    catch (error) {
        console.log('Error al obtener las actividades:', error);
    }
}

async function getFechasActividades(id_act) {
    try {
        const fechasActividades = await pool.query('SELECT * FROM "Programa" WHERE id_act = $1', [id_act]);
        return fechasActividades;
    }
    catch (error) {
        console.log('Error al obtener las fechas de las actividades:', error);
    }
}

async function getFechaActividad(id_act) {
    try {
        const fechaActividad = await pool.query('SELECT * FROM "Programa" WHERE id_act = $1', [id_act]);
        return fechaActividad.rows[0];
    }
    catch (error) {
        console.log('Error al obtener la fecha de la actividad:', error);
    }
}

async function getParticipantesActividad(id_act) {
    try {
        const participantes = await pool.query('SELECT * FROM "Participa" WHERE id_act = $1', [id_act]);
        return participantes.rows;
    }
    catch (error) {
        console.log('Error al obtener los participantes de la actividad:', error);
    }
}

async function setParticipanteActividad(id_act, rut) {
    try {
        const response = await pool.query('INSERT INTO "Participa" (rut, id_act) VALUES ($1, $2) RETURNING *', [rut, id_act]);
        return response.rows[0];
    }
    catch (error) {
        console.log('Error al agregar un participante a la actividad:', error);
    }
}

async function setProgramacionActividad(id_agr, id_act, fecha_actividad) {
    try {
        const response = await pool.query('INSERT INTO "Programa" (id_agr, id_act, fecha_actividad) VALUES ($1, $2, $3) RETURNING *', [id_agr, id_act, fecha_actividad]);
        return response.rows[0];
    }
    catch (error) {
        console.log('Error al programar una actividad:', error);
    }
}

async function setAprobacionActividad(id_act) {
    try {
        const response = await pool.query('UPDATE "Actividad" SET Aprobado = true WHERE id_act = $1 RETURNING *', [id_act]);
        return response.rows[0];
    }
    catch (error) {
        console.log('Error al aprobar una actividad:', error);
    }
}

async function createActividad(actividadData) {
    try {
        const newActividad = await pool.query(
            'INSERT INTO "Actividad"(nom_act, descripcion, imagen, tipo, id_agr, cupos, fecha_creacion) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [actividadData.nom_act, actividadData.descripcion, actividadData.imagen, actividadData.tipo, actividadData.id_agr, actividadData.cupos, actividadData.fecha_creacion]
        );
        // Retorna la nueva actividad insertada
        return newActividad.rows[0];
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la actividad:', error);
        throw error;
    }
}

async function updateCuposActividad(id_act, cupos) {
    try {
        // Actualiza los cupos de la actividad
        const response = await pool.query('UPDATE "Actividad" SET cupos = $1 WHERE id_act = $2 RETURNING *', [cupos, id_act]);
        // Retorna la actividad actualizada
        return response.rows[0];
        
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar la actividad:', error);
        throw error;
    }
}

async function deleteActividad(id) {
    try {
        //Validar que la actividad aun no ocurra
        const fechasActividades = await getFechaActividad(id);
        const fechaActual = new Date();

        if (fechasActividades !== undefined) {
            if (fechaActual > fechasActividades.fecha_actividad) {
                await softDeleteActividad(id);
                return 'Actividad eliminada';
            }
        }
        const cantidadParticipantes = await getParticipantesActividad(id);
        if (cantidadParticipantes.length > 1) {
            const softDelete=await softDeleteActividad(id);
            if(softDelete==='Actividad eliminada'){
                return 'Actividad eliminada para los usuarios';
            }

        }
        else {
            const del = await pool.query('DELETE FROM "Participa" WHERE id_act = $1', [id]);
            const delProg = await pool.query('DELETE FROM "Programa" WHERE id_act = $1', [id]);
            const response = await pool.query('DELETE FROM "Actividad" WHERE id_act = $1', [id]);
            if (response.rowCount !== 0) {
                return 'Actividad eliminada';
            }
        }

    } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        throw error;
    }
}
async function softDeleteActividad(id) {
    try {
        // Elimina la actividad con el id especificado de la base de datos
        const response = await pool.query('UPDATE "Actividad" SET visible = false WHERE id_act = $1', [id]);
        if (response.rowCount === 0) {
            return 'No se encontro la actividad';
        }
        return 'Actividad eliminada';
    } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        throw error;
    }
}

async function deleteActividadPublica(id) {
    try {
        // Elimina la actividad con el id especificado de la base de datos
        const response = await pool.query('DELETE FROM "Actividad" WHERE id_act = $1', [id]);

    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la actividad:', error);
        throw error;
    }
}

async function getActividadesByGrupoUsuario(rut) {
    try {
        // Obtiene todas las actividades del grupo del usuario donde la columna "tipo" es igual a False
        const actividades = await pool.query(`
            SELECT * FROM "Actividad" 
            WHERE tipo = false AND visible = true 
            AND id_agr IN (SELECT id_agr FROM "Pertenece" WHERE rut = $1
            AND id_agr IN (SELECT id_agr FROM "Agrupacion" WHERE visible = true))`, [rut]);
        if (actividades.rows.length === 0) {
            return [];
        }

        // Obtiene los id_act de las actividades que aún no han ocurrido
        const programas = await pool.query(`
            SELECT id_act FROM "Programa" WHERE fecha_actividad > now()
        `);

        const id_actsFuturas = programas.rows.map(row => row.id_act);

        // Filtra las actividades que aún no han ocurrido
        const actividadesFuturas = actividades.rows.filter(actividad => id_actsFuturas.includes(actividad.id_act));
        // Retorna las actividades futuras
        return actividadesFuturas;
    } catch (error) {
        console.log('Error al obtener las actividades de un grupo de usuario:', error);
    }
}

async function getActividadesParticipante(rut) {
    try {
        // Obtiene todas las actividades del participante
        const actividades = await pool.query(`
            SELECT * FROM "Actividad" 
            WHERE id_act IN (SELECT id_act FROM "Participa" WHERE rut = $1)
        `, [rut]);

        if (actividades.rows.length === 0) {
            return [];
        }

        // Obtiene los id_act de las actividades que aún no han ocurrido
        const programas = await pool.query(`
            SELECT id_act FROM "Programa" WHERE fecha_actividad > now()
        `);

        const id_actsFuturas = programas.rows.map(row => row.id_act);

        // Filtra las actividades que aún no han ocurrido
        const actividadesFuturas = actividades.rows.filter(actividad => id_actsFuturas.includes(actividad.id_act));

        // Retorna las actividades futuras
        return actividadesFuturas;
    } catch (error) {
        console.log('Error al obtener las actividades de un participante:', error);
    }
}

async function getActividadesParticipanteUsuario(rut) {
    try {
        // Obtiene todas las actividades del participante
        const actividades = await pool.query(`
            SELECT * FROM "Actividad" 
            WHERE id_act IN (SELECT id_act FROM "Participa" WHERE rut = $1 AND visible = true)
        `, [rut]);

        if (actividades.rows.length === 0) {
            return [];
        }
        //  Obtiene las agrupaciones asociadas a cada actividad del participante
        const agrupaciones = await pool.query(`
            SELECT * FROM "Agrupacion" WHERE id_agr IN (SELECT id_agr FROM "Actividad" WHERE id_act IN (SELECT id_act FROM "Participa" WHERE rut = $1))
        `, [rut]);
        const actividadesFiltradas = actividades.rows.filter(actividad => {
            const agrupacion = agrupaciones.rows.find(agr => agr.id_agr === actividad.id_agr);
            return agrupacion && agrupacion.visible !== false;
        });

        // Obtiene los id_act de las actividades que aún no han ocurrido
        const programas = await pool.query(`
            SELECT id_act FROM "Programa" WHERE fecha_actividad > now()
        `);

        const id_actsFuturas = programas.rows.map(row => row.id_act);
        // Filtra las actividades que aún no han ocurrido
        const actividadesFuturas = actividadesFiltradas.filter(actividad => id_actsFuturas.includes(actividad.id_act));

        // Retorna las actividades futuras
        return actividadesFuturas;
    } catch (error) {
        console.log('Error al obtener las actividades de un participante:', error);
    }
}

async function deleteParticipanteActividad(id_act, rut) {
    try {
        // Elimina el participante de la actividad
        const response = await pool.query('DELETE FROM "Participa" WHERE id_act = $1 AND rut = $2', [id_act, rut]);
        // Retorna un mensaje de éxito como json
        return { success: true, message: 'Participante eliminado de la actividad' };

    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar la participacion de la actividad:', error);
        throw error;
    }
}

async function deletePrograma(id_act) {
    try {
        // Elimina el programa de la actividad
        const fechaPrograma = await pool.query('SELECT * FROM "Programa" WHERE id_act = $1', [id_act]);

        await pool.query('DELETE FROM "Programa" WHERE id_act = $1', [id_act]);

        // Retorna un mensaje de éxito como json
        return { success: true, message: 'Programa eliminado de la actividad', fechaPrograma };

    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar el programa de la actividad:', error);
        throw error;
    }
}



async function getActividadesPublicas() {
    try {
        // Obtiene todas las actividades públicas donde la columna "tipo" es igual a True, la columna "aprobado" es igual a True y fecha_actividad es mayor a la fecha actual
        const actividades = await pool.query('SELECT * FROM "Actividad" WHERE tipo = true AND visible = true AND aprobado = true AND id_act IN (SELECT id_act FROM "Programa" WHERE fecha_actividad > now())');
        // Retorna las actividades
        return actividades.rows;
    } catch (error) {
        console.log('Error al obtener las actividades públicas:', error);
    }
}

async function insertTagsActividad(id_act, tags) {
    try {
      const response = await pool.query('INSERT INTO "Actividad_tags" (id_act, id_tag) VALUES ($1, $2) RETURNING *', [id_act, tags]);
        if (!response) {
          return 'Error al ingresar los tags';
        }
      return 'Tags ingresados correctamente';
    } catch (error) {
      console.log('Error al ingresar los tags:', error);
    }
  }

async function getTagsActividad(id_act) {
    try {
        const tags = await pool.query('SELECT * FROM "Actividad_tags" WHERE id_act = $1', [id_act]);
        if (tags.rows.length === 0) {
            return [];
        }
        return tags.rows;
    } catch (error) {
        console.log('Error al obtener los tags de la actividad:', error);
    }
}

async function getActividadesSinProgramacion(id_agr) {
    try {
        // Obtiene todas las actividades de una agrupacion que no tienen programacion
        const actividades = await pool.query('SELECT id_act, nom_act, fecha_creacion FROM "Actividad" WHERE id_agr = $1 AND id_act NOT IN (SELECT id_act FROM "Programa")', [id_agr]);
        return actividades;
    } catch (error) {
        console.log('Error al obtener las actividades sin programación:', error);
    }
}


module.exports = {
    getActividades,
    getActividadById,
    getActyAgr,
    createActividad,
    updateCuposActividad,
    deleteActividad,
    deleteActividadPublica,
    getActividadesByAgrupacion,
    getFechasActividades,
    getParticipantesActividad,
    setParticipanteActividad,
    setProgramacionActividad,
    getFechaActividad,
    getActividadesByGrupoUsuario,
    getActividadesParticipante,
    deleteParticipanteActividad,
    getActividadesByAgrupacionActivas,
    setAprobacionActividad,
    deletePrograma,
    getActividadesPublicas,
    softDeleteActividad,
    getActividadesParticipanteUsuario,
    insertTagsActividad,
    getTagsActividad,
    getActividadesSinProgramacion,

};