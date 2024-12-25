"use strict";
// Importa el modulo 'path' para obtener la ruta absoluta del archivo .env
const path = require("path");

/**  Obtiene la ruta absoluta del archivo .env. */
const envFilePath = path.resolve(__dirname, ".env");

// Carga las variables de entorno desde el archivo .env
require("dotenv").config({ path: envFilePath });

/** Puerto del servidor */
const PORT = process.env.PORT;

/** Puerto del escucha para Fastify */
const FastifyPort = process.env.FastifyPort;

/** Direcciones IP permitidas por Fastify (0.0.0.0 para todas las direcciones) */
const FastifyHost = process.env.FastifyHost;

/** Host del servidor */
const HOST = process.env.host;

/** URL de la base de datos */
const DB_URL = process.env.DB_URL;

/** Secreto para el token de acceso */
const JWT_SECRET = process.env.JWT_SECRET;

/** Usuario de la base de datos */
const USER = process.env.user;

/** Contraseña de la base de datos */
const PASSWORD = process.env.password;

/** Puerto base de datos */ 
const PortPg = process.env.portpg;

/** Nombre base de datos */
const DATABASE = process.env.database;

/** Correo para enviar notificaciones de la plataforma */
const MAIL_USER = process.env.MAIL_USER;

/** Contraseña del correo */
const MAIL_PASS = process.env.MAIL_PASS;

/** Secreto para las cookies */
const COOKIE_SECRET = process.env.COOKIE_SECRET;

/** URL direccion local + puerto SSH (http://xxx.xxx.xxx:xxxx)*/
const URL= process.env.BASE_URL;

/** URL de la API de ConectaUBB (http://xxx.xxx.xxx:xxxx/ConectaUBB/api)*/
const API_ConectaUBB = process.env.API_URL;

module.exports = { PORT, FastifyPort, FastifyHost, HOST, DB_URL, JWT_SECRET, MAIL_USER, MAIL_PASS, COOKIE_SECRET, URL, API_ConectaUBB, USER, PASSWORD, PortPg, DATABASE };
