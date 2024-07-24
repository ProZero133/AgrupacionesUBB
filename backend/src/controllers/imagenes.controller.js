const { getImagenes, getImagenbyId, createImagen, deleteImagen } = require('../services/imagenes.service');
const { imagenesBodySchema } = require('../schema/imagenes.schema.js');

async function obtenerImagenes(req, reply) {
	try {
		const imagenes = await getImagenes();
		reply.code(200).send(imagenes);
	} catch (error) {
		console.error('Error al obtener las imagenes:', error);
		reply.code(500).send('Error al obtener las imagenes');
	}
}

async function obtenerImagenPorID(req, res) {
	try {
		const { id } = req.params;
		const imagen = await getImagenbyId(id);
		if (imagen.rowCount === 0) {
			reply.code(404).send('Imagen no encontrada');
		} else {
			res.code(200).send(imagen);
		}
	} catch (error) {
		console.error('Error al obtener la imagen:', error);
		reply.code(500).send('Error al obtener la imagen');
	}
}

async function crearImagen(req, res) {
    try {
        // Valida el cuerpo de la solicitud
        const { error, value } = imagenesBodySchema.validate(req.body);

        if (error) {
            console.log("Error en la validación de imagen");
            return res.code(400).send(error.message);
        }

        console.log("La validacion salio bien");

        // Crea una nueva publicacion
        const newimagen = await createImagen(value);

        // Retorna la nueva publicacion
        res.code(201).send(newimagen);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir
        console.error('Error al insertar la imagenn:', error);
        res.code(500).send('Error al insertar la imagennnn');
    }
}

async function eliminarImagen(req, reply) {
	try {
		const { id_imagen } = req.params;
		const rowsDeleted = await deleteImagen(id_imagen);
		if (rowsDeleted === 0) {
			reply.code(404).send('Imagen no encontrada o ya fue eliminada');
		} else {
			reply.code(200).send('Imagen eliminada con éxito');
		}
	} catch (error) {
		console.error('Error al eliminar la imagen:', error);
		reply.code(500).send('Error al eliminar la imagen');
	}
}

module.exports = {
    obtenerImagenes,
    obtenerImagenPorID,
    crearImagen,
    eliminarImagen
};