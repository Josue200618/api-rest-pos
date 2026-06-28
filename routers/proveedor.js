const express = require('express');
const Proveedor = require('../models/proveedor');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Crear
router.post('/proveedores', verificarToken, (req, res) => {
   
    const proveedor = new Proveedor(req.body);

    proveedor.save()
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

// Obtener todos con filtros y paginación
router.get('/proveedores', verificarToken, async (req, res) => {

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

        const proveedores = await Proveedor.find(filtro)
            .skip(skip)
            .limit(Number(limit));

        const total = await Proveedor.countDocuments(filtro);

        res.json({
            total,
            paginaActual: Number(page),
            totalPaginas: Math.ceil(total / limit),
            proveedores
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
// Obtener uno
router.get('/proveedores/:id', verificarToken, (req, res) => {

    Proveedor.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

// Actualizar
router.put('/proveedores/:id', verificarToken, (req, res) => {

    Proveedor.updateOne(
        {_id:req.params.id},
        {$set:req.body}
    )
    .then(data => res.json(data))
    .catch(error => res.json({message:error}));

});

// Eliminar
router.delete('/proveedores/:id', verificarToken, (req, res) => {

    Proveedor.deleteOne({_id:req.params.id})
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

module.exports = router;