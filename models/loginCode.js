const mongoose = require("mongoose");

const loginCodeSchema = new mongoose.Schema({

    usuarioId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "usuario",

        required: true

    },

    codigo: {

        type: String,

        required: true

    },

    tipo: {

        type: String,

        enum: ["login", "reset"],

        default: "login"

    },

    usado: {

        type: Boolean,

        default: false

    },

    creadoEn: {

        type: Date,

        default: Date.now

    },

    expiraEn: {

        type: Date,

        required: true

    }

});

module.exports = mongoose.model(

    "loginCode",

    loginCodeSchema

);