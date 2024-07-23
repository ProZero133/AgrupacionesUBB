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
        // Arma la consulta SQL para insertar un post
        const query = 'INSERT INTO "Post" (id_pub, encabezado) VALUES ($1, $2) RETURNING *';
        // Inserta un nuevo post en la base de datos
        const newPost = await pool.query(query, [postData.id_pub, postData.encabezado]);
        // Retorna el nuevo post creado
        return newPost.rows[0];
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar el post:', error);
        throw error;
    }
}

async function updatePost(id, postData) {
    try {
        // Arma la consulta SQL para actualizar un post
        const query = 'UPDATE "Post" SET encabezado = $1 WHERE id_pub = $2 RETURNING *';
        // Actualiza el post con el id especificado en la base de datos
        const updatedPost = await pool.query(query, [postData.encabezado, id]);
        // Retorna el post actualizado
        return updatedPost.rows[0];
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar el post:', error);
        throw error;
    }
}

async function deletePost(id) {
    try {
        // Arma la consulta SQL para eliminar un post
        const query = 'DELETE FROM "Post" WHERE id_pub = $1';
        // Elimina el post con el id especificado de la base de datos
        const resultado = await pool.query(query, [id]);
        // Retorna el numero de filas eliminadas
        const postEliminado = resultado.rowCount;
        return postEliminado;
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