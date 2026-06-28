const mongoose = require("mongoose");

const detalleCompraSchema = new mongoose.Schema({

    producto: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "ProductoServicio",

        required: true

    },

    nombre: {

        type: String,

        required: true

    },

    precioCompra: {

        type: Number,

        required: true

    },

    cantidad: {

        type: Number,

        required: true

    },

    subtotal: {

        type: Number,

        required: true

    }

});

const compraSchema = new mongoose.Schema({

    proveedor: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Proveedor",

        required: true

    },

    fecha: {

        type: Date,

        default: Date.now

    },

    total: {

        type: Number,

        required: true

    },

    detalles: [detalleCompraSchema],

    estado: {

        type: Boolean,

        default: true

    }

});

module.exports = mongoose.model("Compra", compraSchema);