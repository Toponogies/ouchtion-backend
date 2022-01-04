const nodemailer = require('nodemailer');

export default async function sendMail(mailOptions) {
        // Send mail as account
        let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                        user: process.env.EMAIL_GMAIL,
                        pass: process.env.PASSWORD_GMAIL
                }
        });

        // send mail
        transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                        console.log(err)
                        return console.log('Error send email');
                }
                return console.log('Email sent!!!');
        });
}