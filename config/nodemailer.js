import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465, // or 587
    secure: true,
    auth: {
        user: process.env.EMAIL_FROM_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});