"use strict";

const { getTags, getTagById, createTag, updateTag, deleteTag, getTagByNombre } = require("../services/tags.service.js");
const { tagsBodySchema, tagId } = require("../schema/tags.schema.js");

async function obtenerTags(req, res) {
    try {
        const tags = await getTags();
        res.send(tags);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

async function obtenerTagPorId(req, res) {
    try {

        const id = req;
        const tag = await getTagById(id);
        return tag
    }
    catch (error) {
        console.error("Error al obtener el tag:", error);
       res.code(500).send(error.message);
    }
}

async function crearTag(req, res) {
    try {
        const { body } = req;
        const { error, value } = tagsBodySchema.validate(body);
        if (error) {
            return res.code(400).send(error.message);
        }
        // Validar que el tag no exista
        console.log("Nombre tag:",body.nombre_tag)
        const tagExistente = await obtenerTagPorNombre(body.nombre_tag);
        if (tagExistente) {
            return res.send({ success: false, message: 'El tag ya existe' });
        }

        const tag = await createTag(body);
        res.send(tag);
    } catch (error) {
        res.code(500).send(error.message);
    }
}

async function editarTag(req, res) {
    try {
        const id = req.params.id;
        const { error, value } = tagsBodySchema.validate(req.body);
        if (error) {
            return res.code(400).send(error.message);
        }
        const tag = await updateTag(id, value);
        res.send(tag);
    } catch (error) {
        res.code(500).send(error.message);
    }
}

async function eliminarTag(req, res) {
    try {
        const id = req.params.id;
        const tag = await deleteTag(id);
        res.send(tag);
    } catch (error) {
        res.code(500).send(error.message);
    }
}
async function obtenerTagPorNombre(nombre_tag) {
    try {
        // Obtiene el tag por su nombre
        const tag = await getTagByNombre(nombre_tag);
        console.log("Resultado buscar tag:", tag);
        if (!tag) {
            return null; // No se encontró el tag
        }

        // Retorna el tag encontrado
        return tag;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al obtener el tag:', error);
        throw new Error('Error al obtener el tag');
    }
}

module.exports = {
    obtenerTags,
    obtenerTagPorId,
    crearTag,
    editarTag,
    eliminarTag,
    obtenerTagPorNombre
};

