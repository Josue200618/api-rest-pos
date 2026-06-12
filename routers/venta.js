const express = require('express');
const Venta = require('../models/venta');

const router = express.Router();

// Crear
router.post('/ventas', (req, res) => {

    const venta = new Venta(req.body);

    venta.save()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Obtener todos
router.get('/ventas', (req, res) => {

    Venta.find()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Obtener uno
router.get('/ventas/:id', (req, res) => {

    Venta.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Actualizar
router.put('/ventas/:id', (req, res) => {

    Venta.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    .then(data => res.json(data))
    .catch(error => res.json({ message: error }));

});

// Eliminar
router.delete('/ventas/:id', (req, res) => {

    Venta.deleteOne({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

module.exports = router;