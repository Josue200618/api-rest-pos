const mongoose = require('mongoose');

const productoServicioSchema = mongoose.Schema({
    _id: {
        type: String
    },
    nombre: {
        type: String,
        required: true
    },  
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ProductoServicio', productoServicioSchema);