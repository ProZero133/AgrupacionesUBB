const { pool } = require('../db.js');
const nodemailer = require('nodemailer');
const config = require('../config/configEnv.js');
const fs = require('fs');
const path = require('path');

const mailUser = config.MAIL_USER;
const mailPass = config.MAIL_PASS;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: mailUser,
        pass: mailPass
    }
});

// Function to load and populate the HTML template
function loadHtmlTemplate(filePath, replacements) {
    let template = fs.readFileSync(filePath, 'utf8');

    for (const key in replacements) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, replacements[key]);
    }

    return template;
}

async function notifyPublicacion(publicacion) {
    let oldPub = publicacion.tipoPub;

    if (publicacion.tipoPub == 'post') {
        oldPub = 'Nuevo post';
    } else if (publicacion.tipoPub == 'formulario') {
        oldPub = 'Nuevo formulario';
    }

    if (publicacion.tipoPub == 'post') {
        publicacion.tipoPub = 'un nuevo post';
    } else if (publicacion.tipoPub == 'formulario') {
        publicacion.tipoPub = 'un nuevo formulario';
    }
    const templatePath = path.join(__dirname, '../mails/mailPublicacion.html');
    const replacements = {
        nom_agr: publicacion.nombre_agr,
        tipoPub: publicacion.tipoPub,
        encabezado: publicacion.encabezado,
        descripcion: publicacion.descripcion,
        rut: publicacion.rut
    };

    const htmlBody = loadHtmlTemplate(templatePath, replacements);
    const results = [];

    for (const correo of publicacion.correos) {
        const mailOptions = {
            from: '"ConectaUBB" <conectaubb@gmail.com>',
            to: correo,
            subject: `${oldPub}: ${publicacion.encabezado}`,
            html: htmlBody
        };

        try {
            let info = await transporter.sendMail(mailOptions);
            results.push({ success: true, message: `Correo enviado a ${correo}`, info: info });
        } catch (error) {
            results.push({ success: false, message: `Error al enviar correo a ${correo}`, error: error });
        }
    }

    return results;
}

async function inviteUsuario(invitacion) {
    const templatePath = path.join(__dirname, '../mails/invitacionCorreo.html');
    const replacements = {
        nombre: invitacion.nombre,
        nombre_agr: invitacion.nombre_agr,
        codigo: invitacion.codigo
    };

    const htmlBody = loadHtmlTemplate(templatePath, replacements);
    const results = [];

    const mailOptions = {
        from: '"ConectaUBB" <conectaubb@gmail.com>',
        to: invitacion.correo,
        subject: `Invitación a ${invitacion.nombre_agr}`,
        html: htmlBody
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        results.push({ success: true, message: `Correo enviado a ${invitacion.correo}`, info: info });
    } catch (error) {
        results.push({ success: false, message: `Error al enviar correo a ${invitacion.correo}`, error: error });
    }

    return results;
}

async function integrateUsuario(mailDetails) {

    const templatePath = path.join(__dirname, '../mails/solicitudCorreo.html');
    const replacements = {
        nombre: mailDetails.nombre,
        agrupacion_nombre: mailDetails.nombre_agr,
        rut: mailDetails.rut,
        carrera: mailDetails.carrera,
    };

    const htmlBody = loadHtmlTemplate(templatePath, replacements);
    const results = [];

    const mailOptions = {
        from: '"ConectaUBB" <conectaubb@gmail.com>',
        to: mailDetails.lider_correo,
        subject: `Solicitud de unirse a ${mailDetails.nombre_agr}`,
        html: htmlBody
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        results.push({ success: true, message: `Correo enviado a ${mailDetails.lider_correo}`, info: info });
    } catch (error) {
        results.push({ success: false, message: `Error al enviar correo a ${mailDetails.correo}`, error: error });
    }
    return results;
}

async function notifyAcreditacion(mailDetails) {

    let templatePath;
    let sujeto;
    let replacements;

    if (mailDetails.verificado == 'Verificado') {
        templatePath = path.join(__dirname, '../mails/aprueboCorreo.html');
        replacements = {
            agrupacion: mailDetails.agrupacion,
        };
        sujeto = 'Aprobación de acreditación de agrupación ' + mailDetails.agrupacion;
    } else {
        templatePath = path.join(__dirname, '../mails/rechazoCorreo.html');
        replacements = {
            nombre: mailDetails.nombre,
            correo: mailDetails.correo,
            agrupacion: mailDetails.agrupacion,
            motivo: mailDetails.motivo,
        };
        sujeto = 'Rechazo de acreditación de agrupación ' + mailDetails.agrupacion;
    }

    const htmlBody = loadHtmlTemplate(templatePath, replacements);
    const results = [];

    const mailOptions = {
        from: '"ConectaUBB" <conectaubb@gmail.com>',
        to: mailDetails.correo,
        subject: sujeto,
        html: htmlBody
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        results.push({ success: true, message: `Correo enviado a ${mailDetails.correo}`, info: info });
    } catch (error) {
        results.push({ success: false, message: `Error al enviar correo a ${mailDetails.correo}`, error: error });
    }

    return results;
}

async function notifySolicitudAcritacion(mailDetails) {
    let templatePath;
    let sujeto;
    let replacements;

    templatePath = path.join(__dirname, '../mails/mailSolicitudAcreditacion.html');
    replacements = {
        nombre: mailDetails.nombre,
        correo: mailDetails.correo,
        agrupacion: mailDetails.agrupacion,
        motivo: mailDetails.motivo,
    };
    sujeto = 'Nueva solicitud de acreditación ' + mailDetails.agrupacion;

    const htmlBody = loadHtmlTemplate(templatePath, replacements);
    const results = [];

    const mailOptions = {
        from: '"ConectaUBB" <conectaubb@gmail.com>',
        to: mailDetails.correo,
        subject: sujeto,
        html: htmlBody
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        results.push({ success: true, message: `Correo enviado a ${mailDetails.correo}`, info: info });
    } catch (error) {
        results.push({ success: false, message: `Error al enviar correo a ${mailDetails.correo}`, error: error });
    }

    return results;

}

async function createNotificacion(rut, titulo, descripcion) {
    const query = 'INSERT INTO "Notificacion" (rut, titulo, descripcion) VALUES ($1, $2, $3) RETURNING *';
    const values = [rut, titulo, descripcion];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error al crear notificacion:', error);
        throw error;
    }
}

async function getNotificacionesUsuario(rut) {
    const query = 'SELECT * FROM "Notificacion" WHERE rut = $1';
    const values = [rut];

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener notificaciones del usuario:', error);
        throw error;
    }
}

async function deleteNotificacionesUsuario(rut) {
    const query = 'DELETE FROM "Notificacion" WHERE rut = $1 RETURNING *';
    const values = [rut];

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error al eliminar notificaciones del usuario:', error);
        throw error;
    }
}

async function deleteNotificacion(id_noti) {
    const query = 'DELETE FROM "Notificacion" WHERE id_noti = $1 RETURNING *';
    const values = [id_noti];

    try {
        const result = await pool.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.error('Error al eliminar notificacion:', error);
        throw error;
    }
}


module.exports = {
    notifyPublicacion,
    inviteUsuario,
    integrateUsuario,
    notifyAcreditacion,
    createNotificacion,
    getNotificacionesUsuario,
    deleteNotificacionesUsuario,
    notifySolicitudAcritacion
};