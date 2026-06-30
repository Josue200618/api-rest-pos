const express = require("express");

const transporter = require("../config/mail");

const router = express.Router();

router.get("/test-mail", async (req, res) => {

    try {

        await transporter.sendMail({

            from: `"NovaPOS" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_USER,

            subject: "Prueba NovaPOS",

            html: `

                <h2>Hola 👋</h2>

                <p>Este es el primer correo enviado desde NovaPOS.</p>

                <p>Si recibiste este mensaje, la configuración de Nodemailer funciona correctamente.</p>

            `

        });

        res.json({

            ok: true,

            message: "Correo enviado correctamente"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            ok: false,

            error: error.message

        });

    }

});

module.exports = router;