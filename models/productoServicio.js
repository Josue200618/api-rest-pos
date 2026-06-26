const mongoose = require('mongoose');

const productoServicioSchema = mongoose.Schema({
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
    },
    stock: {
    type: Number,
    default: 0
    },

    estado: {
    type: Boolean,
    default: true
}
});

module.exports = mongoose.model('ProductoServicio', productoServicioSchema);