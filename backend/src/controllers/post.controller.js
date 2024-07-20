"use strict";

const postService = require("../services/post.service");
const { postBodySchema } = require("../schema/post.schema.js");

/**
 * Obtiene todas los posts
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getPosts(req, res) {
    try {
        // Obtiene todas los posts
        const posts = await postService.getPosts();

        // Retorna las publicaciones
        res.status(200).json(posts);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener los posts:', error);
        res.status(500).send('Error al obtener los posts');
    }
}

/**
 * Obtiene un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getPostById(req, res) {
    try {
        // Obtiene el id del post
        const { id } = req.params;

        // Obtiene el post por su id
        const post = await postService.getPostById(id);

        // Retorna el post
        res.status(200).json(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener el post:', error);
        res.status(500).send('Error al obtener el post');
    }
}

/**
 * Crea un nuevo post
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
*/

async function createPost(req, res) {
    try {
        // Valida el cuerpo de la petición
        const { error } = postBodySchema.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Crea un nuevo post
        const post = await postService.createPost(req.body);

        // Retorna el post creado
        res.status(201).json(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al crear el post:', error);
        res.status(500).send('Error al crear el post');
    }
}

/**
 * Actualiza un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function updatePost(req, res) {
    try {
        // Obtiene el id del post
        const { id } = req.params;

        // Valida el cuerpo de la petición
        const { error } = postBodySchema.validate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Actualiza el post por su id
        const post = await postService.updatePost(id, req.body);

        // Retorna el post actualizado
        res.status(200).json(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar el post:', error);
        res.status(500).send('Error al actualizar el post');
    }
}

/**
 * Elimina un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function deletePost(req, res) {
    try {
        // Obtiene el id del post
        const { id } = req.params;

        // Elimina el post por su id
        await postService.deletePost(id);

        // Retorna un mensaje de éxito
        res.status(204).send();
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar el post:', error);
        res.status(500).send('Error al eliminar el post');
    }
}

// Exporta los métodos del controlador
module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};