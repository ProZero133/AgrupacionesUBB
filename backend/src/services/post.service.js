const { pool } = require('../db.js');

async function getPosts() {
   try{
    // Obtiene todos los posts
    const posts = await pool.query('SELECT * FROM "Post"');
    // Retorna los posts
    return posts.rows;
   }
    catch (error) {
      console.log('Error al obtener los posts:', error);
    }
}

async function getPostById(id) {
    try{
        // Obtiene la publicacion con el id especificado
        const post = await pool.query('SELECT * FROM "Post" WHERE id_pub = $1', [id]);
        // Retorna el post
        return post;
    }
    catch (error) {
        console.log('Error al obtener el post:', error);
    }
}

async function createPost(postData) {
    try {
        // Inserta una nuevo post en la base de datos
        const newPost = await Post.create({
            id_pub: post.id_pub,
            encabezado: post.encabezado,
        });

        // Retorna el nuevo post
        return newPost;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar el post:', error);
        throw error;
    }
}

async function updatePost(id, postData) {
    try {
        // Actualiza el post con el id especificado en la base de datos
        const [rowsUpdated, [updatedpost]] = await Post.update({
            id_pub: postData.id_pub,
            encabezado: postData.encabezado,
        }, {
            where: { id: id },
            returning: true
        });

        // Retorna el post actualizado
        return updatedpost;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar el post:', error);
        throw error;
    }
}

async function deletePost(id) {
    try {
        // Elimina el post con el id especificado de la base de datos
        const rowsDeleted = await Post.destroy({
            where: { id: id }
        });

        // Retorna la cantidad de filas eliminadas
        return rowsDeleted;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al eliminar el post:', error);
        throw error;
    }
}

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};