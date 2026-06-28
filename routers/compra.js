const express = require('express');
const Compra = require('../models/compra');
const ProductoServicio = require('../models/productoServicio');
const verificarToken = require('../middleware/auth');


const router = express.Router();

// Crear
router.post('/compras', verificarToken, async (req, res) => {

    try {

        const compra = new Compra(req.body);

        await compra.save();

        // Actualizar inventario
        for (const item of compra.detalles) {

            const producto = await ProductoServicio.findById(item.producto);

            if (!producto) continue;

            producto.stock += item.cantidad;

            await producto.save();

        }

        res.status(201).json({

            message: "Compra registrada correctamente",

            compra

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

// Obtener todos con filtros y paginación
router.get('/compras', verificarToken, async (req, res) => {

    try {

        const { estado, page = 1, limit = 5 } = req.query;

        let filtro = {};

        if (estado !== undefined) {

            filtro.estado = estado === 'true';

        }

        const skip = (page - 1) * limit;

        const compras = await Compra.find(filtro)

            .populate(
                "proveedor",
                "nombre apellido telefono correo"
            )

            .populate(
                "detalles.producto",
                "nombre tipo"
            )

            .skip(skip)

            .limit(Number(limit));

        const total = await Compra.countDocuments(filtro);

        res.json({
            total,
            paginaActual: Number(page),
            totalPaginas: Math.ceil(total / limit),
            compras
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// Obtener uno
router.get('/compras/:id', verificarToken, (req, res) => {

    Compra.findById(req.params.id)
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));

});


// Anular compra
router.put('/compras/anular/:id', verificarToken, async (req, res) => {

    try {

        const compra = await Compra.findById(req.params.id);

        if (!compra) {

            return res.status(404).json({
                message: 'Compra no encontrada'
            });

        }

        if (!compra.estado) {

            return res.status(400).json({
                message: 'La compra ya está anulada'
            });

        }

        // Verificar que el stock no quede negativo
        for (const item of compra.detalles) {

            const producto = await detalles.findById(item.producto)

            if (producto) {

                if (producto.stock < item.cantidad) {

                    return res.status(400).json({
                        message: `No se puede anular la compra porque parte del inventario del producto ${producto.nombre} ya fue vendido`
                    });

                }

            }

        }

        // Disminuir stock
        for (const item of compra.productos_servicios) {

            const producto = await detalles.findById(item.producto);

            if (producto) {

                producto.stock -= item.cantidad;

                await producto.save();

            }

        }

        // Marcar compra como anulada
        compra.estado = false;

        await compra.save();

        res.json({
            message: 'Compra anulada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;