const express = require('express');
const Proveedor = require('../models/proveedor');

const router = express.Router();

// Crear
router.post('/proveedores', (req, res) => {

    const proveedor = new Proveedor(req.body);

    proveedor.save()
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

// Obtener todos
router.get('/proveedores', (req, res) => {

    Proveedor.find()
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

// Obtener uno
router.get('/proveedores/:id', (req, res) => {

    Proveedor.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

// Actualizar
router.put('/proveedores/:id', (req, res) => {

    Proveedor.updateOne(
        {_id:req.params.id},
        {$set:req.body}
    )
    .then(data => res.json(data))
    .catch(error => res.json({message:error}));

});

// Eliminar
router.delete('/proveedores/:id', (req, res) => {

    Proveedor.deleteOne({_id:req.params.id})
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

module.exports = router;