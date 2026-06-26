const express = require('express');
const ProductoServicio = require('../models/productoServicio');
const Cliente = require('../models/cliente');
const Proveedor = require('../models/proveedor');
const Compra = require('../models/compra');
const Venta = require('../models/venta');
const verificarToken = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', verificarToken, async (req, res) => {

    try {

        const totalProductos = await ProductoServicio.countDocuments();
        const totalClientes = await Cliente.countDocuments();
        const totalProveedores = await Proveedor.countDocuments();
        const totalCompras = await Compra.countDocuments();
        const totalVentas = await Venta.countDocuments();

        const productosActivos = await ProductoServicio.countDocuments({ estado: true });
        const clientesActivos = await Cliente.countDocuments({ estado: true });
        const proveedoresActivos = await Proveedor.countDocuments({ estado: true });
        const comprasActivas = await Compra.countDocuments({ estado: true });
        const ventasActivas = await Venta.countDocuments({ estado: true });

        res.json({

            totalProductos,
            totalClientes,
            totalProveedores,
            totalCompras,
            totalVentas,

            productosActivos,
            clientesActivos,
            proveedoresActivos,
            comprasActivas,
            ventasActivas

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;