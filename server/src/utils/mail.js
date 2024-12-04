import NodeMailer from 'nodemailer';
const transporter = NodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_NODEMAILER,
    pass: process.env.PASSWORD_NODEMAILER,
  },
});

export const sendMail = async (email, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"BMT Life ❤️" <wowstore@gmail.com>',
      to: email,
      subject: subject,
      html: html,
    });
    return 1;
  } catch (error) {
    return 0;
  }
};
