const transporter = require("../config/mail");

const sendMail = async (

    to,

    subject,

    html

) => {

    return await transporter.sendMail({

        from: '"NovaPOS" <jersonsena2026@gmail.com>',

        to,

        subject,

        html

    });

};

module.exports = {

    sendMail

};