const mongoose = require('mongoose');

const perfilSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    descripcion: { type: String, default: '¡Hola! Soy nuevo en la plataforma.'},
    avatar: { type: String, default: 'https://res.cloudinary.com/dkrcosw87/image/upload/v1634020134/avatars/avatar-default.png' },
    });

module.exports = mongoose.model('Perfil', perfilSchema);