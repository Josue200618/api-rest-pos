const mongoose = require("mongoose");

const detalleVentaSchema = new mongoose.Schema({

    producto: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductoServicio",
        required: true

    },

    nombre: {

        type: String,
        required: true

    },

    precioVenta: {

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

const ventaSchema = new mongoose.Schema({

    cliente: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
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

    detalles: [detalleVentaSchema],

    estado: {

        type: Boolean,
        default: true

    }

});

module.exports = mongoose.model("Venta", ventaSchema);