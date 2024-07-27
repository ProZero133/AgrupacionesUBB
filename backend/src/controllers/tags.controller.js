"use strict";

const { getTags, getTagById, createTag, updateTag, deleteTag } = require("../services/tags.service.js");
const { tagBodySchema, tagId } = require("../schema/tags.schema.js");

async function obtenerTags(req, res) {
    try {
        const tags = await getTags();
        res.send(tags);
    } catch (error) {
        res.code(500).send(error.message);
    }
}

async function obtenerTagPorId(req, res) {
    try {
        const id = req.params.id;
        const tag = await getTagById(id);
        res.send(tag);
    } catch (error) {
        res.code(500).send(error.message);
    }
}

async function crearTag(req, res) {
    try {
        const { error, value } = tagBodySchema.validate(req.body);
        if (error) {
            return res.code(400).send(error.message);
        }
        const tag = await createTag(value);
        res.send(tag);
    } catch (error) {
        res.code(500).send(error.message);
    }
}

async function editarTag(req, res) {
    try {
        const id = req.params.id;
        const { error, value } = tagBodySchema.validate(req.body);
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

module.exports = {
    obtenerTags,
    obtenerTagPorId,
    crearTag,
    editarTag,
    eliminarTag
};

