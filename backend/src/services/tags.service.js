const { pool } = require("../db.js");

async function getTags() {
    try{
        // Obtiene todas las etiquetas
        const tags = await pool.query('SELECT * FROM "Tags"');
        // Retorna las etiquetas
        return tags.rows;
    }
    catch (error) {
        console.log('Error al obtener los tags:', error);
    }
}

async function getTagById(id) {
    try {
        // Obtiene la etiqueta con el id especificado de la base de datos
        const tag = await pool.query('SELECT * FROM "Tags" WHERE id_etq = $1', [id]);

        // Retorna la etiqueta
        return tag;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener el tag:', error);
        throw error;
    }
}

async function createTag(tagData) {
    try {
        const newTag = await pool.query(
            'INSERT INTO "Tags"(nombre, rut) VALUES($1, $2) RETURNING *',
            [tagData.nombre_tag, tagData.rut]
        );
        // Retorna la nueva etiqueta insertada
        return newTag.rows[0];
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar el tag:', error);
        throw error;
    }
}

async function updateTag(id, tagData) {
    try {
        const [rowsUpdated, [updatedTag]] = await Tag.update({
            nombre_tag: tagData.nombre_tag,
            rut: tagData.rut
        }, {
            where : { id: id },
            returning: true
        });

        // Retorna la etiqueta actualizada
        return updatedTag;
    }catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al actualizar el tag:', error);
        throw error;
    }
}

async function deleteTag(id) {
    try {
        const rowsDeleted = await Tag.destroy({
            where: { id: id }
        });
        return rowsDeleted;
    } catch (error) {
        console.error('Error al eliminar el tag:', error);
        throw error;
    }
}

module.exports = {
    getTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag
};