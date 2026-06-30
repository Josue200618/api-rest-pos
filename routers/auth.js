const express = require('express');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const keys = require('../settings/keys');
const LoginCode = require('../models/loginCode');
const generateLoginCode = require('../utils/loginCodeGenerator');
const transporter = require('../config/mail');

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


// Login (Paso 1: correo + contraseña)
router.post('/login', async (req, res) => {

    try {

        const { correo, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            return res.status(400).json({
                message: "Usuario no encontrado"
            });

        }

        // Verificar contraseña
        if (usuario.password !== password) {

            return res.status(400).json({
                message: "Contraseña incorrecta"
            });

        }

        // Generar código de 6 dígitos
        const codigo = generateLoginCode();

        // Fecha de expiración (5 minutos)
        const expiraEn = new Date(
            Date.now() + 5 * 60 * 1000
        );

        // Eliminar códigos anteriores del usuario
        await LoginCode.deleteMany({

            usuarioId: usuario._id,

            tipo: "login",

            usado: false

        });

        // Guardar nuevo código
        await LoginCode.create({

            usuarioId: usuario._id,

            codigo,

            tipo: "login",

            expiraEn

        });

        // Enviar correo
        await transporter.sendMail({

            from: `"NovaPOS" <${process.env.EMAIL_USER}>`,

            to: usuario.correo,

            subject: "Código de acceso NovaPOS",

            html: `

                <div style="font-family:Arial;padding:25px">

                    <h2>Hola ${usuario.nombre}</h2>

                    <p>Tu código para iniciar sesión es:</p>

                    <h1 style="letter-spacing:8px;color:#1976d2">

                        ${codigo}

                    </h1>

                    <p>

                        Este código expirará en 5 minutos.

                    </p>

                </div>

            `

        });

        res.json({

            ok: true,

            message: "Se envió un código de verificación a tu correo.",

            correo: usuario.correo

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

// Verificar código de inicio de sesión
router.post("/verify-login-code", async (req, res) => {

    try {

        const { correo, codigo } = req.body;

        if (!correo || !codigo) {

            return res.status(400).json({

                message: "Correo y código son obligatorios"

            });

        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            return res.status(404).json({

                message: "Usuario no encontrado"

            });

        }

        // Buscar código
        const loginCode = await LoginCode.findOne({

            usuarioId: usuario._id,

            codigo,

            tipo: "login",

            usado: false

        });

        if (!loginCode) {

            return res.status(400).json({

                message: "Código inválido"

            });

        }

        // Verificar expiración
        if (new Date() > loginCode.expiraEn) {

            return res.status(400).json({

                message: "El código ha expirado"

            });

        }

        // Marcar código como usado
        loginCode.usado = true;

        await loginCode.save();

        // Generar JWT
        const payload = {

            id: usuario._id,

            correo: usuario.correo

        };

        const token = jwt.sign(

            payload,

            keys.key,

            {

                expiresIn: "7d"

            }

        );

        return res.json({

            ok: true,

            message: "Inicio de sesión exitoso",

            token,

            usuario: {

                id: usuario._id,

                nombre: usuario.nombre,

                correo: usuario.correo,

                telefono: usuario.telefono

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

// Solicitar recuperación de contraseña
router.post("/forgot-password", async (req, res) => {

    try {

        const { correo } = req.body;

        if (!correo) {

            return res.status(400).json({

                message: "El correo es obligatorio"

            });

        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            return res.status(404).json({

                message: "Usuario no encontrado"

            });

        }

        // Generar código
        const codigo = generateLoginCode();

        const expiraEn = new Date(

            Date.now() + 5 * 60 * 1000

        );

        // Eliminar códigos anteriores
        await LoginCode.deleteMany({

            usuarioId: usuario._id,

            tipo: "reset",

            usado: false

        });

        // Guardar nuevo código
        await LoginCode.create({

            usuarioId: usuario._id,

            codigo,

            tipo: "reset",

            expiraEn

        });

        // Enviar correo
        await transporter.sendMail({

            from: `"NovaPOS" <${process.env.EMAIL_USER}>`,

            to: usuario.correo,

            subject: "Recuperación de contraseña NovaPOS",

            html: `

                <div style="font-family:Arial;padding:25px">

                    <h2>Hola ${usuario.nombre}</h2>

                    <p>Solicitaste recuperar tu contraseña.</p>

                    <p>Tu código es:</p>

                    <h1 style="letter-spacing:8px;color:#1976d2">

                        ${codigo}

                    </h1>

                    <p>

                        El código expirará en 5 minutos.

                    </p>

                    <p>

                        Si no realizaste esta solicitud puedes ignorar este correo.

                    </p>

                </div>

            `

        });

        res.json({

            ok: true,

            message: "Se envió el código de recuperación al correo."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

// Verificar código de recuperación
router.post("/verify-reset-code", async (req, res) => {

    try {

        const { correo, codigo } = req.body;

        if (!correo || !codigo) {

            return res.status(400).json({

                message: "Correo y código son obligatorios"

            });

        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            return res.status(404).json({

                message: "Usuario no encontrado"

            });

        }

        // Buscar código
        const loginCode = await LoginCode.findOne({

            usuarioId: usuario._id,

            codigo,

            tipo: "reset",

            usado: false

        });

        if (!loginCode) {

            return res.status(400).json({

                message: "Código inválido"

            });

        }

        // Verificar expiración
        if (new Date() > loginCode.expiraEn) {

            return res.status(400).json({

                message: "El código ha expirado"

            });

        }

        res.json({

            ok: true,

            message: "Código válido."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

// Restablecer contraseña
router.post("/reset-password", async (req, res) => {

    try {

        const {

            correo,

            codigo,

            password,

            confirmPassword

        } = req.body;

        if (

            !correo ||

            !codigo ||

            !password ||

            !confirmPassword

        ) {

            return res.status(400).json({

                message: "Todos los campos son obligatorios"

            });

        }

        if (password !== confirmPassword) {

            return res.status(400).json({

                message: "Las contraseñas no coinciden"

            });

        }

        // Buscar usuario
        const usuario = await Usuario.findOne({

            correo

        });

        if (!usuario) {

            return res.status(404).json({

                message: "Usuario no encontrado"

            });

        }

        // Buscar código
        const loginCode = await LoginCode.findOne({

            usuarioId: usuario._id,

            codigo,

            tipo: "reset",

            usado: false

        });

        if (!loginCode) {

            return res.status(400).json({

                message: "Código inválido"

            });

        }

        // Verificar expiración
        if (new Date() > loginCode.expiraEn) {

            return res.status(400).json({

                message: "El código ha expirado"

            });

        }

        // Actualizar contraseña
        usuario.password = password;

        await usuario.save();

        // Marcar código como usado
        loginCode.usado = true;

        await loginCode.save();

        res.json({

            ok: true,

            message: "Contraseña actualizada correctamente."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

module.exports = router;