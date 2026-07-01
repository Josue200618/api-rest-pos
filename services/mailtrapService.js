const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({

    token: process.env.MAILTRAP_API_TOKEN

});

const sender = {

    email: "hello@demomailtrap.co",

    name: "NovaPOS"

};

const sendMail = async (

    to,

    subject,

    html

) => {

    return await client.send({

        from: sender,

        to: [

            {

                email: to

            }

        ],

        subject,

        html

    });

};

module.exports = {

    sendMail

};