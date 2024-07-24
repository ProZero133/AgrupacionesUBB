"use strict";
// Importa el modulo 'path' para obtener la ruta absoluta del archivo .env
const path = require("path");

/**  Obtiene la ruta absoluta del archivo .env. */
const envFilePath = path.resolve(__dirname, ".env");

// Carga las variables de entorno desde el archivo .env
require("dotenv").config({ path: envFilePath });

/** Puerto del servidor */
const PORT = process.env.PORT;
/** Host del servidor */
const HOST = process.env.HOST;
/** URL de la base de datos */
const DB_URL = process.env.DB_URL;
/** Secreto para el token de acceso */
const JWT_SECRET = process.env.JWT_SECRET;
/** Secreto para el token de refresco */
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const URL= process.env.BASE_URL;

module.exports = { PORT, HOST, DB_URL, JWT_SECRET, REFRESH_JWT_SECRET, MAIL_USER, MAIL_PASS, COOKIE_SECRET, URL};
