const User = require('../models/user.model');
const Perfil = require('../models/perfil.model');
const bcrypt = require('bcryptjs');

const crearUsuario = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.contraseña, 10);
    const newUser = new User({
        nombre: req.body.nombre,
        rut: req.body.rut,
        email: req.body.email,
        contraseña: hashedPassword,
        intereses: req.body.intereses,
    });

    const newPerfil = new Perfil({
        usuario: newUser._id,
    });

    User.Perfil = newPerfil._id;

    try {
        await newUser.save();
        await newPerfil.save();
        res.json('Usuario creado exitosamente');
    }
    catch (error) {
        res.status(400).json({ error });
    }
}

const buscarUsuario = async (req, res) => {
    const { nombre, rut, intereses } = req.params;
    const query = {};

    if (nombre) query.nombre = nombre;
    if (rut) query.rut = rut;
    if (intereses) query.intereses = intereses;

    try {
        const usuarios = await User.find(query);
        res.json(usuarios);
    }
    catch (error) {
        res.status(400).json({ error });
    }
};

const iniciarSesion = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const usuario = await User.findOne
        ({ email });
        if (!usuario) {
            return res.status(400).json('Usuario no encontrado');
        }
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(400).json('Contraseña incorrecta');
        }
        const token = jwt.sign({ _id: usuario._id }, secret);
        res.header('auth-token', token).json(token);
    }
    catch (error) {
        res.status(400).json({ error });
    }
}

module.exports = { crearUsuario, buscarUsuario, iniciarSesion };

    
// Path: backend/src/controllers/user.controller.js