"use strict";

const fastify = require('../config/configFastify.js');

const actividadRoutes = require('./actividad.routes');
const agrupacionRoutes = require('./agrupacion.routes');
const publicacionRoutes = require('./publicacion.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('../');
/** Enrutador de autenticación */

/** Middlewares*/



fastify.register(actividadRoutes, { prefix: '/actividad' });
fastify.register(agrupacionRoutes, { prefix: '/agrupacion' });
fastify.register(publicacionRoutes, { prefix: '/publicacion' });
fastify.register(userRoutes, { prefix: '/user' });



module.exports = fastify;
