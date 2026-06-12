const express = require('express');
const Cliente = require('../models/cliente');

const router = express.Router();

// Crear
router.post('/clientes', (req, res) => {

    const cliente = new Cliente(req.body);

    cliente.save()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Obtener todos
router.get('/clientes', (req, res) => {

    Cliente.find()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Obtener uno
router.get('/clientes/:id', (req, res) => {

    Cliente.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Actualizar
router.put('/clientes/:id', (req, res) => {

    Cliente.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Eliminar
router.delete('/clientes/:id', (req, res) => {

    Cliente.deleteOne({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

module.exports = router;