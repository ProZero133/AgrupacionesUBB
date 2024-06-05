const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const createUser = async (req, res) => {
    const { nombre, rut, email, contraseña, intereses } = req.body;
    const newUser = new User({ nombre, rut, email, contraseña, intereses });

    try {
        const salt = await bcrypt.genSalt(10);
        newUser.contraseña = await bcrypt.hash(contraseña, salt);
        await newUser.save();
        res.json('Usuario creado exitosamente');
    }
    catch (error) {
        res.status(400).json({ error });
    }
}

const findUser = async (req, res) => {
    const { nombre, rut, intereses } = req.params;
    const query = {};

    if (nombre) query.nombre = nombre;
    if (rut) query.rut = rut;
    if (intereses) query.intereses = intereses;

    try {
        const users = await User.find(query);
        res.json(users);
    }
    catch (error) {
        res.status(400).json({ error });
    }
}

const login = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const user = await User
        .findOne
        ({ email });
        if (!user) {
            return res.status(400).json('Usuario no encontrado');
        }
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) {
            return res.status(400).json('Contraseña incorrecta');
        }
        const token = jwt.sign({ _id: user._id }, secret);
        res.header('auth-token', token).json(token);
    }
    catch (error) {
        res.status(400).json({ error });
    }
}

module.exports = { createUser, findUser, login };