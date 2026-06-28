const express = require('express');
const Venta = require('../models/venta');
const ProductoServicio = require('../models/productoServicio');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Crear
router.post('/ventas', verificarToken, async (req, res) => {

    try {

        if (!req.body.detalles || req.body.detalles.length === 0) {

    return res.status(400).json({

        message: "Debe agregar al menos un producto."

    });

}

        // Verificar stock de todos los productos
    for (const item of req.body.detalles) {

    const producto = await ProductoServicio.findById(item.producto);

    if (!producto) {

        return res.status(404).json({
            message: `El producto ${item.producto} no existe`
        });

    }

    if (producto.stock < item.cantidad) {

        return res.status(400).json({
            message: `Stock insuficiente para el producto ${producto.nombre}`
        });

    }

}




        // Guardar venta
        const venta = new Venta(req.body);

        await venta.save();

        // Restar stock
        for (const item of req.body.detalles) {

            const producto = await ProductoServicio.findById(item.producto);

            producto.stock -= item.cantidad;

            await producto.save();

        }

        res.json({
            message: 'Venta registrada correctamente',
            venta
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// Obtener todos con filtros y paginación
router.get('/ventas', verificarToken, async (req, res) => {

    try {

        const { estado, page = 1, limit = 5 } = req.query;

        let filtro = {};

        if (estado !== undefined) {

            filtro.estado = estado === 'true';

        }

        const skip = (page - 1) * limit;

        const ventas = await Venta.find(filtro)

        .populate(

            "cliente",

            "nombre apellido telefono correo"

        )

        .populate(

            "detalles.producto",

            "nombre tipo"

        )

        .skip(skip)

        .limit(Number(limit));

        const total = await Venta.countDocuments(filtro);

        res.json({
            total,
            paginaActual: Number(page),
            totalPaginas: Math.ceil(total / limit),
            ventas
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// Obtener uno
router.get('/ventas/:id', verificarToken, (req, res) => {

    Venta.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Actualizar
router.put('/ventas/:id', verificarToken, (req, res) => {

    Venta.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    .then(data => res.json(data))
    .catch(error => res.json({ message: error }));

});

// Eliminar
router.delete('/ventas/:id', verificarToken, (req, res) => {

    Venta.deleteOne({ _id: req.params.id })
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});

// Anular venta
router.put('/ventas/anular/:id', verificarToken, async (req, res) => {

    try {

        const venta = await Venta.findById(req.params.id);

        if (!venta) {

            return res.status(404).json({
                message: 'Venta no encontrada'
            });

        }

        if (!venta.estado) {

            return res.status(400).json({
                message: 'La venta ya está anulada'
            });

        }

        // Devolver productos al stock
        for (const item of venta.detalles) {

    const producto = await ProductoServicio.findById(item.producto);

    if (producto) {

        producto.stock += item.cantidad;

        await producto.save();

    }

    }

        // Marcar la venta como anulada
        venta.estado = false;

        await venta.save();

        res.json({
            message: 'Venta anulada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;