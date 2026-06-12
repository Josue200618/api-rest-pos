const mongoose = require('mongoose');

const clienteSchema = mongoose.Schema({
    _id: {
        type: String
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Cliente', clienteSchema);