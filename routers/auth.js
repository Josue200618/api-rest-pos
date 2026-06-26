const express = require('express');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const keys = require('../settings/keys');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {

    try {

        const {
            nombre,
            correo,
            telefono,
            password,
            confirmPassword
        } = req.body;

        // Verificar campos vacíos
        if (!nombre || !correo || !telefono || !password || !confirmPassword) {

            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });

        }

        // Verificar contraseñas
        if (password !== confirmPassword) {

            return res.status(400).json({
                message: 'Las contraseñas no coinciden'
            });

        }

        // Verificar si el correo ya existe
        const existeUsuario = await Usuario.findOne({ correo });

        if (existeUsuario) {

            return res.status(400).json({
                message: 'El correo ya está registrado'
            });

        }

        // Crear usuario
        const usuario = new Usuario({
            nombre,
            correo,
            telefono,
            password
        });

        await usuario.save();

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            usuario
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// Login
router.post('/login', async (req, res) => {

    try {

        const { correo, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            return res.status(400).json({
                message: 'Usuario no encontrado'
            });

        }

        // Verificar contraseña
        if (usuario.password !== password) {

            return res.status(400).json({
                message: 'Contraseña incorrecta'
            });

        }

        // Crear payload
        const payload = {
            id: usuario._id,
            correo: usuario.correo
        };

        // Generar token
        const token = jwt.sign(
            payload,
            keys.key,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            message: 'Autenticación exitosa',
            token
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;