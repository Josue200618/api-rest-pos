const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    telefono: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    estado: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('Usuario', usuarioSchema);