const express = require('express');
const ProductoServicio = require('../models/productoServicio');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Crear
router.post('/productos', verificarToken, async (req, res) => {

    try {

        console.log(req.body);

        const producto = new ProductoServicio(req.body);

        const data = await producto.save();

        res.status(201).json(data);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});
// Obtener todos con filtros y paginación
router.get('/productos', verificarToken, async (req, res) => {

    try {

        const { nombre, estado, page = 1, limit = 5 } = req.query;

        let filtro = {};

        // Filtrar por nombre
        if (nombre) {

            filtro.nombre = {
                $regex: nombre,
                $options: 'i'
            };

        }

        // Filtrar por estado
        if (estado !== undefined) {

            filtro.estado = estado === 'true';

        }

        // Calcular paginación
        const skip = (page - 1) * limit;

        // Buscar productos
        const productos = await ProductoServicio.find(filtro)
            .skip(skip)
            .limit(Number(limit));

        // Total de registros encontrados
        const total = await ProductoServicio.countDocuments(filtro);

        res.json({
            total,
            paginaActual: Number(page),
            totalPaginas: Math.ceil(total / limit),
            productos
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// Obtener uno
router.get('/productos/:id', verificarToken, (req, res) => {

    ProductoServicio.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({message:error}));

});

// Actualizar
router.put('/productos/:id', verificarToken, async (req, res) => {

    try {

        console.log("ID recibido:", req.params.id);
        console.log("Datos recibidos:", req.body);

        const resultado = await ProductoServicio.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );

        console.log(resultado);

        res.json(resultado);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});
// Eliminar
router.delete('/productos/:id', verificarToken, (req, res) => {

    ProductoServicio.deleteOne({_id:req.params.id})
    .then(data => res.json(data))
    .catch(error => res.json({message:error}));

});

module.exports = router;