const express = require('express');
const ProductoServicio = require('../models/productoServicio');

const router = express.Router();

// Crear
router.post('/productos', (req, res) => {
    const producto = new ProductoServicio(req.body);

    producto.save()
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));
});

// Obtener todos
router.get('/productos', (req, res) => {
    ProductoServicio.find()
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));
});

// Obtener uno
router.get('/productos/:id', (req, res) => {

    ProductoServicio.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

// Actualizar
router.put('/productos/:id', (req, res) => {

    ProductoServicio.updateOne(
        {_id:req.params.id},
        {$set:req.body}
    )
    .then(data => res.json(data))
    .catch(error => res.json({message:error}));

});

// Eliminar
router.delete('/productos/:id', (req, res) => {

    ProductoServicio.deleteOne({_id:req.params.id})
    .then(data => res.json(data))
    .catch(error => res.json({message:error}));

});

module.exports = router;