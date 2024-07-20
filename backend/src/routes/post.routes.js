const fastify = require('../config/configFastify.js');

const { createPost, getPosts, getPost, updatePost, deletePost } = require('../controllers/post.controller.js');

module.exports = function (fastify, opts, done) {
    fastify.post('/posts', createPost);
    fastify.get('/posts', getPosts);
    fastify.get('/posts/:id', getPost);
    fastify.put('/posts/:id', updatePost);
    fastify.delete('/posts/:id', deletePost);
    
    done();
};