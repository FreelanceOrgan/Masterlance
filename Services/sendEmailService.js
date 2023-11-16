const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.host,
		port: 465, 
		secure: true,
		auth: {
			user: process.env.auth_user,
			pass: process.env.auth_pass
		},
	});

	const mailOptions = {
		from: `${process.env.App_Name} <${process.env.auth_user}>`,
		to: options.email,
		subject: options.subject,
		html: options.message
	}

	await transporter.sendMail(mailOptions);
};