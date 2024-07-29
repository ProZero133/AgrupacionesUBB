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

    if (publicacion.tipoPub == 'votacion'){
        oldPub = 'Nueva votación';
    } else if (publicacion.tipoPub == 'post'){
        oldPub = 'Nuevo post';
    } else if (publicacion.tipoPub == 'formulario'){
        oldPub = 'Nuevo formulario';
    }

    if (publicacion.tipoPub == 'votacion'){
        publicacion.tipoPub = 'una nueva votación';
    } else if (publicacion.tipoPub == 'post'){
        publicacion.tipoPub = 'un nuevo post';
    } else if (publicacion.tipoPub == 'formulario'){
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

module.exports = { notifyPublicacion };