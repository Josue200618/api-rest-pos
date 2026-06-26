const express = require('express');
const Cliente = require('../models/cliente');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Crear
router.post('/clientes', verificarToken, async (req, res) => {

    try {

        console.log("BODY RECIBIDO:");
        console.log(req.body);

        const cliente = new Cliente(req.body);

        const data = await cliente.save();

        console.log("CLIENTE GUARDADO:");
        console.log(data);

        res.status(201).json(data);

    } catch (error) {

        console.log("ERROR AL GUARDAR CLIENTE:");
        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});
// Obtener todos con filtros y paginación
router.get('/clientes', verificarToken,  async (req, res) => {

    try {

        const { nombre, estado, page = 1, limit = 5 } = req.query;

        let filtro = {};

        if (nombre) {

            filtro.nombre = {
                $regex: nombre,
                $options: 'i'
            };

        }

        if (estado !== undefined) {

            filtro.estado = estado === 'true';

        }

        const skip = (page - 1) * limit;

        const clientes = await Cliente.find(filtro)
            .skip(skip)
            .limit(Number(limit));

        const total = await Cliente.countDocuments(filtro);

        res.json({
            total,
            paginaActual: Number(page),
            totalPaginas: Math.ceil(total / limit),
            clientes
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// Obtener uno
router.get('/clientes/:id', verificarToken, (req, res) => {

    Cliente.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Actualizar
router.put('/clientes/:id', verificarToken, (req, res) => {

    Cliente.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Eliminar
router.delete('/clientes/:id', verificarToken, (req, res) => {

    Cliente.deleteOne({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

module.exports = router;