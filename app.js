const express=require('express');
const mongoose=require('mongoose');
require('dotenv').config();


const productoRoutes = require('./routers/productoServicio');
const proveedorRoutes = require('./routers/proveedor');
const clienteRoutes = require('./routers/cliente');
const compraRoutes = require('./routers/compra');
const ventaRoutes = require('./routers/venta');

const app=express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', productoRoutes);
app.use('/api', proveedorRoutes);
app.use('/api', clienteRoutes);
app.use('/api', compraRoutes);
app.use('/api', ventaRoutes);


//routes
app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

// Conexion a MongoDB
mongoose.connect(process.env.MONGODB_URI,).then(() => 
console.log('Connected to MongoDB Atlas')).catch((error) => console.error('Error connecting to MongoDB:', error));

// escuchar el servidor
app.listen(port, () => console.log("Server listening to", port));