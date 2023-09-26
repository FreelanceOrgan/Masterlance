// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
require("dotenv").config({path: "config.env"});
const asyncHandler = require("express-async-handler");

exports.sendEmail = asyncHandler(async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.host,
        port: 465, 
        secure: true, //if false, port = 587 and if true, port = 465
        auth: {
            user: process.env.auth_user,
            pass: process.env.auth_pass
        },
    });

    const mailOptions = {
        from: `E-shop <${process.env.auth_user}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    }

    await transporter.sendMail(mailOptions);
})
