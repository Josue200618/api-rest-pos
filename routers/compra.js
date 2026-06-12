const express = require('express');
const Compra = require('../models/compra');

const router = express.Router();

// Crear
router.post('/compras', (req, res) => {

    const compra = new Compra(req.body);

    compra.save()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Obtener todos
router.get('/compras', (req, res) => {

    Compra.find()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Obtener uno
router.get('/compras/:id', (req, res) => {

    Compra.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Actualizar
router.put('/compras/:id', (req, res) => {

    Compra.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Eliminar
router.delete('/compras/:id', (req, res) => {

    Compra.deleteOne({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

module.exports = router;