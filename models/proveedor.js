const mongoose = require('mongoose');

const proveedorSchema = mongoose.Schema({
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
    },
    direccion: {
        type: String,
        required: true
    },
    estado: {
    type: Boolean,
    default: true
}
});

module.exports = mongoose.model('Proveedor', proveedorSchema);