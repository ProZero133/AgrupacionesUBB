import { User } from "../models/user.model";

const Perfil = require('../models/perfil.model');
const User = require('../models/user.model');


const getProfile = async (req, res) => {
    const { email } = req.params;

    try {
        const perfil = await Perfil.findOne({ email });
        res.json(perfil);
    }
    catch (error) {
        res.status(400).json({ error });
    }
}

const updateProfile = async (req, res) => {
    const { email } = req.params;
    const { descripcion, avatar } = req.body;

    try {
        const perfil = await Perfil.findOne
        ({ email });
        perfil.descripcion = descripcion;
        perfil.avatar = avatar;
        await perfil.save();
        res.json('Perfil actualizado exitosamente');
    }
    catch (error) {
        res.status(400).json({ error });
    }
}

module.exports = { getProfile, updateProfile };

