const {createNotificacion, getNotificacionesUsuario, deleteNotificacionesUsuario, deleteNotificacion} = require('../services/mail.service.js');
const {obtenerUsuarioPorRut} = require('../controllers/user.controller.js');
async function crearNotificacion(req, res) {
    try {
        //Obtiene el rut de los params
        const rut = req.params.rut;
        const titulo = req.params.titulo;
        //Obtiene la descripcion de la notificacion
        const descripcion = req.params.descripcion;
        //Valida si el rut existe en la plataforma
        const usuario = await obtenerUsuarioPorRut(rut);
        if (usuario.length === 0) {
            return res.send({ success: false, message: 'No se encontró el usuario' });
        }
        //Crea la notificacion
        const notificacion = await createNotificacion(rut, titulo, descripcion);
        return res.send({ success: true, message: 'Notificacion creada', notificacion });

    } catch (error) {
        console.error("Error al crear notificacion: ", error);
        return res.status(500).send({ success: false, message: 'Error al crear notificacion' });
    }
}

async function obtenerNotificacionesUsuario(req, res) {
    try {
        const rut = req.params.rut;
        const notificaciones = await getNotificacionesUsuario(rut);
        if (notificaciones.length === 0) {
            return res.send({ success: false, message: 'No se encontraron notificaciones' });
        }
        return res.send({ success: true, notificaciones });
    } catch (error) {
        console.error('Error al obtener las notificaciones del usuario:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las notificaciones del usuario' });
    }
}

async function limpiarNotificacionesUsuario(req, res) {
    try {
        const rut = req.params.rut;
        const notificaciones = await deleteNotificacionesUsuario(rut);
        if (notificaciones.length === 0) {
            return res.send({ success: false, message: 'No se encontraron notificaciones' });
        }
        return res.send({ success: true, message: 'Notificaciones eliminadas' });
    } catch (error) {
        console.error('Error al obtener las notificaciones del usuario:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las notificaciones del usuario' });
    }
}

async function limpiarNotificacion(req, res) {
    try {
        const id_noti = req.params.id_noti;
        const notificaciones = await deleteNotificacion(id_noti);
        if (notificaciones.length === 0) {
            return res.send({ success: false, message: 'No se encontraron notificaciones' });
        }
        return res.send({ success: true, message: 'Notificacion eliminada' });
    } catch (error) {
        console.error('Error al obtener las notificaciones del usuario:', error);
        return res.status(500).send({ success: false, message: 'Error al obtener las notificaciones del usuario' });
    }
}

module.exports = {
    crearNotificacion,
    obtenerNotificacionesUsuario,
    limpiarNotificacionesUsuario,
    limpiarNotificacion
};