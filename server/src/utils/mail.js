import NodeMailer from 'nodemailer';
import env from 'dotenv';
const transporter = NodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: env.EMAIL_NODEMAILER, // generated ethereal user
    pass: env.PASSWORD_NODEMAILER, // generated ethereal password
  },
});

export const sendMail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: '"Wow store ❤️" <wowstore@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Mã OTP của bạn', // Subject line
      html: `<h2>${otp}</h2>`, // html body
    });
    return 1;
  } catch (error) {
    return 0;
  }
};
