const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendActivationMail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Account activation on ${process.env.API_URL}`,
    text: 'Account activation',
    html: `
      <div>
        <h1>Click the link below to activate your account</h1>
        <a href="${link}">Activate Account</a>
      </div>
    `,
  });
};

module.exports = sendActivationMail;
