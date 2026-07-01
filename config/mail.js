const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    logger: true,
    debug: true
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("VERIFY ERROR:");
        console.log(error);
    } else {
        console.log("SMTP READY");
    }
});

module.exports = transporter;