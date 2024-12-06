const { func } = require('joi');
const { pool } = require('../db.js');

async function getActividades() {
    try {
        // Obtiene todas las actividades
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
        // Obtiene todas las actividades de una agrupacion
        const actividades = await pool.query('SELECT * FROM "Actividad" WHERE id_agr = $1', [id_agr]);
        // Retorna las actividades
        return actividades.rows;
    }
    catch (error) {
        console.log('Error al obtener las actividades:', error);
    }
}

async function getFechasActividades(id_agr) {
    try {
        const fechasActividades = await pool.query('SELECT fecha_actividad FROM "Programa" WHERE id_agr = $1', [id_agr]);
        return fechasActividades.rows;
    }
    catch (error) {
        console.log('Error al obtener las fechas de las actividades:', error);
    }
}

async function getFechaActividad(id_act) {
    try {
        const fechaActividad = await pool.query('SELECT fecha_actividad FROM "Programa" WHERE id_act = $1', [id_act]);
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

async function updateActividad(id, actividadData) {
    try {
        // Actualiza la actividad con el id especificado en la base de datos
        const [rowsUpdated, [updatedActividad]] = await Actividad.update({
            nom_act: actividadData.nom_act,
            descripcion: actividadData.descripcion,
            imagen: actividadData.imagen,
            tipo: actividadData.tipo,
            id_agr: actividadData.id_agr
        }, {
            where: { id: id },
            returning: true
        });

        // Retorna la actividad actualizada
        return updatedActividad;
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
        
        if (fechaActual > fechasActividades.fecha_actividad) {
            return 'No es posible eliminar una actividad que ya ocurrio';
        }
        // Elimina la actividad con el id especificado de la base de datos
        const response = await pool.query('DELETE FROM "Actividad" WHERE id_act = $1', [id]);

    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
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
        // Obtiene todas las actividades del grupo del usuario
        const actividades = await pool.query(`
            SELECT * FROM "Actividad" 
            WHERE id_agr IN (SELECT id_agr FROM "Pertenece" WHERE rut = $1)
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
        return { success: true, message: 'Programa eliminado de la actividad', fechaPrograma};

    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar el programa de la actividad:', error);
        throw error;
    }
}



// Exporta las funciones auxiliares de la actividad
module.exports = {
    getActividades,
    getActividadById,
    getActyAgr,
    createActividad,
    updateActividad,
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
    deletePrograma

};