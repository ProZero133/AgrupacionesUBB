"use strict";

const {getPosts, getPostById, createPost, updatePost, deletePost} = require("../services/post.service");
const postBodySchema  = require("../schema/post.schema.js");

/**
 * Obtiene todas los posts
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function obtenerPosts(req, res) {
    try {
        // Obtiene todas los posts
        const posts = await getPosts();

        // Retorna las publicaciones
        res.code(201).send(posts);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener los posts:', error);
        res.code(500).send('Error al obtener los posts');
    }
}

/**
 * Obtiene un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function obtenerPostPorId(req, res) {
    try {
        // Obtiene el id del post
        const { id } = req.params;

        // Obtiene el post por su id
        const post = await getPostById(id);

        // Retorna el post
        res.code(200).send(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener el post:', error);
        res.code(500).send('Error al obtener el post');
    }
}

/**
 * Crea un nuevo post
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
*/

async function crearPost(req, res) {
    try {

        // Valida el cuerpo de la petición
        const { error } = postBodySchema.validate(req.body);

        if (error) {
            res.code(400).send(error.details.map(detail => detail.message));
            return;
        }

        // Crea un nuevo post
        const post = await createPost(req.body);

        // Retorna el post creado
        res.code(201).send(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al crear el post:', error);
        res.code(500).send('Error al crear el post');
    }
}

/**
 * Actualiza un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function actualizarPost(req, res) {
    try {
        // Obtiene el id del post
        const { id } = req.params;

        // Valida el cuerpo de la petición
        const { error } = postBodySchema.validate(req.body);

        if (error) {
            return res.code(400).send(error.details[0].message);
        }

        // Actualiza el post por su id
        const post = await updatePost(id, req.body);

        // Retorna el post actualizado
        res.code(200).send(post);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar el post:', error);
        res.code(500).send('Error al actualizar el post');
    }
}

/**
 * Elimina un post por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function eliminarPost(req, res) {
    try {
        // Obtiene el id del post
        const { id } = req.params;

        // Elimina el post por su id
        await deletePost(id);

        // Retorna un mensaje de éxito
        res.code(204).send();
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar el post:', error);
        res.code(500).send('Error al eliminar el post');
    }
}

// Exporta los métodos del controlador
module.exports = {
    obtenerPosts,
    obtenerPostPorId,
    crearPost,
    actualizarPost,
    eliminarPost
};