"use strict";
const fastify = require('../config/configFastify.js');
const actividadRoutes = require('../routes/actividad.routes');
const agrupacionRoutes = require('../routes/agrupacion.routes');
const publicacionRoutes = require('../routes/publicacion.routes');
const userRoutes = require('../routes/user.routes');
const adminRoutes = require('../routes/admin.routes');


fastify.register(actividadRoutes, { prefix: '/actividad' });
fastify.register(agrupacionRoutes, { prefix: '/agrupacion' });
fastify.register(publicacionRoutes, { prefix: '/publicacion' });
fastify.register(userRoutes, { prefix: '/user' });
fastify.register(adminRoutes, { prefix: '/admin' });


module.exports = fastify;
