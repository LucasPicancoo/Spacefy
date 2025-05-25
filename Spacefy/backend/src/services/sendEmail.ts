import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro serviço de e-mail que você quiser
  auth: {
    user: process.env.EMAIL_USER, // seu e-mail
    pass: process.env.EMAIL_PASS, // sua senha ou app password
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado para:', to);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};
