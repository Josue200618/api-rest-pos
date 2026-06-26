const mongoose = require('mongoose');

const compraSchema = mongoose.Schema({
    _id: {
        type: String
    },
    proveedor_id: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    productos_servicios: [
        {
            producto_servicio_id: String,
            nombre: String,
            precio: Number,
            cantidad: Number
        }
    ],
    estado: {
    type: Boolean,
    default: true
}
});

module.exports = mongoose.model('Compra', compraSchema);