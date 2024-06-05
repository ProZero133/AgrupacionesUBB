const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true},
    rut: { type: String, required: true},
    email: { type: String, required: true},
    contraseña: { type: String, required: true},
    intereses: [String],
    grupos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agrupacion' }],
    eventos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }],
    });

module.exports = mongoose.model('User', userSchema);