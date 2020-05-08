"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function enviar(id,email) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
 auth: {
        user: 'omar.wst13@gmail.com',
        pass: 'omar1360'
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"ZAZA" <noReplay@zaza.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "Correo de Confirmacion ZAZA", // Subject line
    text: `https://zaza-team.herokuapp.com/api/usuario/confirmar/${id}`, // plain text body
    html: `<b><a href="https://zaza-team.herokuapp.com/api/usuario/confirmar/${id}">Click Aqui</a></b>` // html body
  });


}

module.exports = enviar